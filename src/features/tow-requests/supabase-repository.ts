import type { SupabaseClient } from "@supabase/supabase-js";
import { demoDrivers } from "@/features/demo/drivers";
import { demoJobStatuses } from "@/features/demo/job-statuses";
import { calculateQuote } from "@/features/pricing/pricing-engine";
import { manualVehicleToSnapshot } from "@/features/vehicles/types";
import { estimateRoute } from "@/lib/mapbox/mapbox-service";
import type { AvailableDriver, Coordinate, ServiceTypeId, TowRequestPayload, TowStatus, TowTrip } from "./types";

export type SupabaseTowRecord = TowTrip & {
  customer: { name: string; phone: string };
  vehicleId: string | null;
  vehicleSnapshot: NonNullable<TowRequestPayload["vehicleSnapshot"]>;
  vehicle: { make: string; model: string; year?: string; color?: string };
  pickup: TowTrip["pickup"] & { address: string };
  dropoff?: TowTrip["dropoff"] & { address: string };
  backendProvider: "supabase";
};

type DbServiceCode =
  | "STANDARD_TOW"
  | "FLATBED_TOW"
  | "JUMP_START"
  | "FLAT_TIRE"
  | "LOCKOUT"
  | "FUEL_DELIVERY"
  | "WINCH_OUT"
  | "ACCIDENT_TOW"
  | "MOTORCYCLE_TOW"
  | "BATTERY_HELP"
  | "VEHICLE_TRANSPORT"
  | "HEAVY_DUTY_TOW"
  | "BOX_TRUCK_TOW"
  | "PRIVATE_PROPERTY_TOW"
  | "EMERGENCY_ROADSIDE";

const serviceCodeById: Record<ServiceTypeId, DbServiceCode> = {
  standard_tow: "STANDARD_TOW",
  flatbed_tow: "FLATBED_TOW",
  jump_start: "JUMP_START",
  flat_tire: "FLAT_TIRE",
  lockout: "LOCKOUT",
  fuel_delivery: "FUEL_DELIVERY",
  winch_out: "WINCH_OUT",
  accident_tow: "ACCIDENT_TOW",
  motorcycle_tow: "MOTORCYCLE_TOW",
  battery_help: "BATTERY_HELP",
  vehicle_transport: "VEHICLE_TRANSPORT",
  heavy_duty_tow: "HEAVY_DUTY_TOW",
  box_truck_tow: "BOX_TRUCK_TOW",
  private_property_tow: "PRIVATE_PROPERTY_TOW",
  emergency_roadside: "EMERGENCY_ROADSIDE",
};

const serviceIdByCode = Object.fromEntries(Object.entries(serviceCodeById).map(([id, code]) => [code, id])) as Record<DbServiceCode, ServiceTypeId>;

const statusByDbStatus: Record<string, TowStatus> = {
  QUOTE_CREATED: "quote_created",
  AWAITING_PAYMENT: "awaiting_payment",
  PAID: "paid",
  SEARCHING_FOR_DRIVER: "searching_for_driver",
  DRIVER_ASSIGNED: "driver_assigned",
  DRIVER_ON_THE_WAY: "driver_on_the_way",
  DRIVER_ARRIVED: "driver_arrived",
  VEHICLE_PICKED_UP: "vehicle_picked_up",
  IN_TRANSIT: "in_transit",
  VEHICLE_DELIVERED: "vehicle_delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

export function serviceTypeIdToDbCode(serviceType: ServiceTypeId): DbServiceCode {
  return serviceCodeById[serviceType];
}

export function dbServiceCodeToServiceTypeId(code: DbServiceCode): ServiceTypeId {
  return serviceIdByCode[code];
}

export function normalizeGuestPhone(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "+10000000000";
  if (trimmed.startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

export function guestEmailForPhone(phone: string): string {
  return `guest+${normalizeGuestPhone(phone).replace(/\D/g, "")}@guest.roadassistnow.local`;
}

export async function createSupabaseTowRequest(supabase: SupabaseClient, payload: TowRequestPayload): Promise<SupabaseTowRecord> {
  const now = new Date().toISOString();
  const phone = normalizeGuestPhone(payload.phone);
  const email = guestEmailForPhone(phone);
  const customerName = payload.customerName.trim();
  const userId = crypto.randomUUID();
  const customerId = crypto.randomUUID();

  const user = await upsertGuestUser(supabase, { id: userId, email, phone, now });
  await upsertGuestProfile(supabase, { id: crypto.randomUUID(), userId: user.id, customerName, now });
  const customer = await upsertGuestCustomer(supabase, { id: customerId, userId: user.id, now });
  const service = await findServiceType(supabase, payload.serviceType);
  const routeEstimate = await estimateRoute(payload.pickupAddress, payload.dropoffAddress);
  const quote = calculateQuote({
    serviceType: payload.serviceType,
    distanceMiles: routeEstimate.distanceMiles,
    heavyVehicle: payload.heavyVehicle,
    vehicleType: payload.vehicleType ?? payload.vehicleSnapshot?.vehicleType,
    rush: payload.rush,
  });
  const vehicleSnapshot = structuredClone(payload.vehicleSnapshot ?? manualVehicleToSnapshot({
    vehicleId: payload.vehicleId ?? null,
    make: payload.vehicleMake,
    model: payload.vehicleModel,
    year: payload.vehicleYear ?? "",
    color: payload.vehicleColor ?? "",
    licensePlate: payload.licensePlate ?? "",
    vehicleType: payload.vehicleType ?? "Sedan",
  }));
  const requestId = crypto.randomUUID();

  const insertRequest = await supabase
    .from("tow_requests")
    .insert({
      id: requestId,
      customerId: customer.id,
      vehicle_id: payload.vehicleId ?? null,
      serviceTypeId: service.id,
      status: "AWAITING_PAYMENT",
      pickupAddress: payload.pickupAddress,
      pickupLat: routeEstimate.pickup.lat,
      pickupLng: routeEstimate.pickup.lng,
      dropoffAddress: payload.dropoffAddress || null,
      dropoffLat: payload.dropoffAddress ? routeEstimate.dropoff.lat : null,
      dropoffLng: payload.dropoffAddress ? routeEstimate.dropoff.lng : null,
      distanceMiles: routeEstimate.distanceMiles,
      etaMinutes: quote.estimatedEtaMinutes,
      vehicleMake: vehicleSnapshot.make,
      vehicleModel: vehicleSnapshot.model,
      vehicleYear: vehicleSnapshot.year || null,
      vehicleColor: vehicleSnapshot.color || null,
      vehiclePhotoUrl: vehicleSnapshot.photoUrl || null,
      vehicle_snapshot: vehicleSnapshot,
      notes: payload.notes || null,
      quoteCents: quote.subtotalCents,
      totalCents: quote.totalCents,
      createdAt: now,
      updatedAt: now,
    })
    .select("id, status, createdAt")
    .single();

  if (insertRequest.error) {
    throw new Error(`Could not save tow request: ${insertRequest.error.message}`);
  }

  const status = await supabase.from("tow_status_updates").insert({
    id: crypto.randomUUID(),
    towRequestId: requestId,
    status: "AWAITING_PAYMENT",
    message: "Guest request created. Payment authorization is the next dispatch gate.",
    createdAt: now,
  });

  if (status.error) {
    await supabase.from("tow_requests").delete().eq("id", requestId);
    throw new Error(`Could not save request timeline: ${status.error.message}`);
  }

  return buildSupabaseRecord({
    id: requestId,
    status: "awaiting_payment",
    quote,
    payload,
    phone,
    customerName,
    vehicleSnapshot,
    route: routeEstimate.route,
    pickup: routeEstimate.pickup,
    dropoff: routeEstimate.dropoff,
    timelineCreatedAt: now,
  });
}

export async function listRecentSupabaseTowRequests(supabase: SupabaseClient, limit = 20): Promise<SupabaseTowRecord[]> {
  const { data, error } = await supabase
    .from("tow_requests")
    .select("id,status,pickupAddress,dropoffAddress,pickupLat,pickupLng,dropoffLat,dropoffLng,distanceMiles,etaMinutes,vehicleMake,vehicleModel,vehicleYear,vehicleColor,vehicle_snapshot,quoteCents,totalCents,createdAt,service_types(code,name),customers(users(phone,email,profiles(firstName,lastName)))")
    .order("createdAt", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Could not list tow requests: ${error.message}`);

  return (data ?? []).map((row) => recordFromSupabaseRow(row as Record<string, unknown>));
}

async function upsertGuestUser(supabase: SupabaseClient, input: { id: string; email: string; phone: string; now: string }) {
  const existing = await supabase.from("users").select("id,email,phone").eq("email", input.email).maybeSingle();
  if (existing.error) throw new Error(`Could not look up guest user: ${existing.error.message}`);
  if (existing.data) return existing.data as { id: string; email: string; phone: string | null };

  const created = await supabase.from("users").insert({
    id: input.id,
    email: input.email,
    phone: input.phone,
    role: "CUSTOMER",
    createdAt: input.now,
    updatedAt: input.now,
  }).select("id,email,phone").single();
  if (created.error) throw new Error(`Could not create guest user: ${created.error.message}`);
  return created.data as { id: string; email: string; phone: string | null };
}

async function upsertGuestCustomer(supabase: SupabaseClient, input: { id: string; userId: string; now: string }) {
  const existing = await supabase.from("customers").select("id,userId").eq("userId", input.userId).maybeSingle();
  if (existing.error) throw new Error(`Could not look up guest customer: ${existing.error.message}`);
  if (existing.data) return existing.data as { id: string; userId: string };

  const created = await supabase.from("customers").insert({
    id: input.id,
    userId: input.userId,
    createdAt: input.now,
    updatedAt: input.now,
  }).select("id,userId").single();
  if (created.error) throw new Error(`Could not create guest customer: ${created.error.message}`);
  return created.data as { id: string; userId: string };
}

async function upsertGuestProfile(supabase: SupabaseClient, input: { id: string; userId: string; customerName: string; now: string }) {
  const nameParts = splitCustomerName(input.customerName);
  const existing = await supabase.from("profiles").select("id,userId").eq("userId", input.userId).maybeSingle();
  if (existing.error) throw new Error(`Could not look up guest profile: ${existing.error.message}`);
  if (existing.data) {
    const updated = await supabase.from("profiles").update({ firstName: nameParts.firstName, lastName: nameParts.lastName, updatedAt: input.now }).eq("id", existing.data.id);
    if (updated.error) throw new Error(`Could not update guest profile: ${updated.error.message}`);
    return existing.data as { id: string; userId: string };
  }

  const created = await supabase.from("profiles").insert({
    id: input.id,
    userId: input.userId,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    createdAt: input.now,
    updatedAt: input.now,
  }).select("id,userId").single();
  if (created.error) throw new Error(`Could not create guest profile: ${created.error.message}`);
  return created.data as { id: string; userId: string };
}

async function findServiceType(supabase: SupabaseClient, serviceType: ServiceTypeId) {
  const code = serviceTypeIdToDbCode(serviceType);
  const { data, error } = await supabase.from("service_types").select("id,code,name").eq("code", code).eq("active", true).single();
  if (error) throw new Error(`Service ${code} is not configured in Supabase. Apply service seed migration first.`);
  return data as { id: string; code: DbServiceCode; name: string };
}

function buildSupabaseRecord(input: {
  id: string;
  status: TowStatus;
  quote: SupabaseTowRecord["quote"];
  payload: TowRequestPayload;
  phone: string;
  customerName: string;
  vehicleSnapshot: NonNullable<TowRequestPayload["vehicleSnapshot"]>;
  route: SupabaseTowRecord["route"];
  pickup: Coordinate;
  dropoff: Coordinate;
  timelineCreatedAt: string;
}): SupabaseTowRecord {
  const driver = demoDrivers.find((candidate) => candidate.services.includes(input.payload.serviceType)) ?? demoDrivers[0];
  return {
    id: input.id,
    status: input.status,
    quote: input.quote,
    pickupAddress: input.payload.pickupAddress,
    dropoffAddress: input.payload.dropoffAddress,
    driver: { ...driver, status: "offered" },
    pickup: { ...input.pickup, address: input.payload.pickupAddress },
    dropoff: { ...input.dropoff, address: input.payload.dropoffAddress ?? "Service location only" },
    route: input.route,
    timeline: buildInitialTimeline(input.timelineCreatedAt, driver),
    customer: { name: input.customerName, phone: input.phone },
    vehicleId: input.payload.vehicleId ?? null,
    vehicleSnapshot: input.vehicleSnapshot,
    vehicle: {
      make: input.vehicleSnapshot.make,
      model: input.vehicleSnapshot.model,
      year: input.vehicleSnapshot.year,
      color: input.vehicleSnapshot.color,
    },
    backendProvider: "supabase",
  };
}

function recordFromSupabaseRow(row: Record<string, unknown>): SupabaseTowRecord {
  const service = row.service_types as { code?: DbServiceCode } | null;
  const serviceType = service?.code ? dbServiceCodeToServiceTypeId(service.code) : "standard_tow";
  const distanceMiles = Number(row.distanceMiles ?? 0);
  const vehicleSnapshot = (row.vehicle_snapshot ?? {
    make: String(row.vehicleMake ?? "Vehicle"),
    model: String(row.vehicleModel ?? ""),
    year: String(row.vehicleYear ?? ""),
    color: String(row.vehicleColor ?? ""),
    licensePlate: "",
    vehicleType: "Sedan",
  }) as NonNullable<TowRequestPayload["vehicleSnapshot"]>;
  const quote = calculateQuote({ serviceType, distanceMiles });
  quote.subtotalCents = Number(row.quoteCents ?? quote.subtotalCents);
  quote.totalCents = Number(row.totalCents ?? quote.totalCents);
  const createdAt = String(row.createdAt ?? new Date().toISOString());
  const customer = extractCustomer(row);
  return buildSupabaseRecord({
    id: String(row.id),
    status: statusByDbStatus[String(row.status)] ?? "quote_created",
    quote,
    payload: {
      customerName: customer.name,
      phone: customer.phone,
      serviceType,
      pickupAddress: String(row.pickupAddress ?? "Unknown pickup"),
      dropoffAddress: typeof row.dropoffAddress === "string" ? row.dropoffAddress : undefined,
      vehicleMake: String(row.vehicleMake ?? vehicleSnapshot.make),
      vehicleModel: String(row.vehicleModel ?? vehicleSnapshot.model),
      vehicleYear: typeof row.vehicleYear === "string" ? row.vehicleYear : undefined,
      vehicleColor: typeof row.vehicleColor === "string" ? row.vehicleColor : undefined,
    },
    phone: customer.phone,
    customerName: customer.name,
    vehicleSnapshot,
    route: [
      { lat: Number(row.pickupLat ?? 40.7484), lng: Number(row.pickupLng ?? -73.9857) },
      { lat: Number(row.dropoffLat ?? row.pickupLat ?? 40.7614), lng: Number(row.dropoffLng ?? row.pickupLng ?? -73.9776) },
    ],
    pickup: { lat: Number(row.pickupLat ?? 40.7484), lng: Number(row.pickupLng ?? -73.9857) },
    dropoff: { lat: Number(row.dropoffLat ?? row.pickupLat ?? 40.7614), lng: Number(row.dropoffLng ?? row.pickupLng ?? -73.9776) },
    timelineCreatedAt: createdAt,
  });
}

function splitCustomerName(customerName: string) {
  const parts = customerName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "Guest",
    lastName: parts.slice(1).join(" ") || "Customer",
  };
}

function extractCustomer(row: Record<string, unknown>) {
  const customerRow = row.customers as { users?: { phone?: string | null; profiles?: Array<{ firstName?: string; lastName?: string }> | { firstName?: string; lastName?: string } | null } | null } | null;
  const user = customerRow?.users;
  const rawProfiles = user?.profiles;
  const profile = Array.isArray(rawProfiles) ? rawProfiles[0] : rawProfiles;
  const name = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim() || "Guest customer";
  return { name, phone: user?.phone || "+10000000000" };
}

function buildInitialTimeline(createdAt: string, driver: AvailableDriver) {
  return demoJobStatuses
    .filter((item) => ["quote_created", "awaiting_payment", "paid", "searching_for_driver", "driver_assigned", "driver_on_the_way", "completed"].includes(item.status))
    .map((item, index) => ({
      status: item.status,
      label: item.status === "driver_assigned" ? `${driver.name} pending assignment` : item.label,
      timestamp: new Date(new Date(createdAt).getTime() + index * 60_000).toISOString(),
      complete: item.status === "quote_created" || item.status === "awaiting_payment",
    }));
}
