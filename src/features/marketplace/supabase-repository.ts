import type { SupabaseClient } from "@supabase/supabase-js";
import { dbServiceCodeToServiceTypeId } from "@/features/tow-requests/supabase-repository";
import type { ServiceTypeId } from "@/features/tow-requests/types";
import type { DispatchAssignmentInput, DriverApprovalInput, DriverJobStatusInput, ProviderApplicationInput } from "./schemas";
import {
  buildProviderApplicationRecord,
  dbStatusToDriverAction,
  isAllowedDriverStatusTransition,
  statusMessageFor,
  type DbDriverStatus,
  type DbTowStatus,
} from "./workflow";

type AnyRow = Record<string, unknown>;

export type MarketplaceDriverSummary = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: DbDriverStatus;
  rating: number;
  truck: string;
  services: ServiceTypeId[];
  approvedAt: string | null;
  createdAt: string;
};

export type DispatchRequestSummary = {
  id: string;
  shortId: string;
  customer: string;
  phone: string;
  service: string;
  status: DbTowStatus;
  pickup: string;
  dropoff: string | null;
  totalCents: number;
  assignedDriver: string | null;
  action: ReturnType<typeof dbStatusToDriverAction>;
  createdAt: string;
};

export function mapDriverRows(rows: AnyRow[]): MarketplaceDriverSummary[] {
  return rows.map((row) => {
    const user = row.users as AnyRow | null;
    const profile = firstNested(user?.profiles);
    const truck = firstNested(row.tow_trucks);
    const services = Array.isArray(truck?.services) ? truck.services.map((code) => dbServiceCodeToServiceTypeId(String(code) as never)) : [];

    return {
      id: String(row.id),
      name: displayName(profile, "Provider operator"),
      email: String(user?.email ?? "unknown email"),
      phone: String(user?.phone ?? ""),
      status: String(row.status ?? "PENDING_APPROVAL") as DbDriverStatus,
      rating: Number(row.rating ?? 5),
      truck: String(truck?.label ?? truck?.truckType ?? "Provider truck"),
      services,
      approvedAt: typeof row.approvedAt === "string" ? row.approvedAt : null,
      createdAt: String(row.createdAt ?? ""),
    };
  });
}

export function mapTowRequestRows(rows: AnyRow[]): DispatchRequestSummary[] {
  return rows.map((row) => {
    const customerUser = (row.customers as AnyRow | null)?.users as AnyRow | null;
    const driver = row.drivers as AnyRow | null;
    const driverUser = driver?.users as AnyRow | null;
    const status = String(row.status ?? "QUOTE_CREATED") as DbTowStatus;

    return {
      id: String(row.id),
      shortId: String(row.id).slice(0, 8).toUpperCase(),
      customer: displayName(firstNested(customerUser?.profiles), "Guest customer"),
      phone: String(customerUser?.phone ?? ""),
      service: String((row.service_types as AnyRow | null)?.name ?? (row.service_types as AnyRow | null)?.code ?? "Roadside service"),
      status,
      pickup: String(row.pickupAddress ?? "Unknown pickup"),
      dropoff: typeof row.dropoffAddress === "string" ? row.dropoffAddress : null,
      totalCents: Number(row.totalCents ?? 0),
      assignedDriver: driver ? displayName(firstNested(driverUser?.profiles), "Assigned provider") : null,
      action: dbStatusToDriverAction(status),
      createdAt: String(row.createdAt ?? ""),
    };
  });
}

export async function createProviderApplication(supabase: SupabaseClient, input: ProviderApplicationInput): Promise<MarketplaceDriverSummary> {
  const now = new Date().toISOString();
  const rows = buildProviderApplicationRecord({
    now,
    userId: crypto.randomUUID(),
    profileId: crypto.randomUUID(),
    providerAccountId: crypto.randomUUID(),
    termsAcceptanceId: crypto.randomUUID(),
    driverId: crypto.randomUUID(),
    truckId: crypto.randomUUID(),
    input,
  });

  const existing = await supabase.from("users").select("id").eq("email", rows.user.email).maybeSingle();
  if (existing.error) throw new Error(`Could not check provider email: ${existing.error.message}`);
  if (existing.data) throw new Error("A provider account with this email already exists.");

  const user = await supabase.from("users").insert(rows.user).select("id").single();
  if (user.error) throw new Error(`Could not create provider user: ${user.error.message}`);

  const profile = await supabase.from("profiles").insert(rows.profile).select("id").single();
  if (profile.error) throw new Error(`Could not create provider profile: ${profile.error.message}`);

  const providerAccount = await supabase.from("provider_accounts").insert(rows.providerAccount).select("id").single();
  if (providerAccount.error) throw new Error(`Could not create provider account: ${providerAccount.error.message}`);

  if (rows.termsAcceptance) {
    const terms = await supabase.from("provider_terms_acceptances").insert(rows.termsAcceptance).select("id").single();
    if (terms.error) throw new Error(`Could not record provider guideline acceptance: ${terms.error.message}`);
  }

  const driver = await supabase.from("drivers").insert(rows.driver).select("id").single();
  if (driver.error) throw new Error(`Could not create provider driver row: ${driver.error.message}`);

  const truck = await supabase.from("tow_trucks").insert(rows.truck).select("id").single();
  if (truck.error) throw new Error(`Could not create provider truck: ${truck.error.message}`);

  const [summary] = mapDriverRows([{ ...rows.driver, users: { ...rows.user, profiles: rows.profile }, tow_trucks: [rows.truck] }]);
  return summary;
}

export async function listMarketplaceDrivers(supabase: SupabaseClient): Promise<MarketplaceDriverSummary[]> {
  const { data, error } = await supabase
    .from("drivers")
    .select("id,status,rating,approvedAt,createdAt,users(email,phone,profiles(firstName,lastName)),tow_trucks(label,truckType,plateNumber,services)")
    .order("createdAt", { ascending: false });

  if (error) throw new Error(`Could not list providers: ${error.message}`);
  return mapDriverRows((data ?? []) as AnyRow[]);
}

export async function updateDriverApproval(supabase: SupabaseClient, input: DriverApprovalInput): Promise<MarketplaceDriverSummary> {
  const patch = {
    status: input.status,
    approvedAt: input.status === "APPROVED" ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  };
  const { error } = await supabase.from("drivers").update(patch).eq("id", input.driverId);
  if (error) throw new Error(`Could not update provider approval: ${error.message}`);
  const drivers = await listMarketplaceDrivers(supabase);
  const driver = drivers.find((candidate) => candidate.id === input.driverId);
  if (!driver) throw new Error("Provider updated but could not be reloaded.");
  return driver;
}

export async function listDispatchRequests(supabase: SupabaseClient): Promise<DispatchRequestSummary[]> {
  const { data, error } = await supabase
    .from("tow_requests")
    .select("id,status,pickupAddress,dropoffAddress,totalCents,createdAt,service_types(code,name),customers(users(phone,profiles(firstName,lastName))),drivers(id,users(profiles(firstName,lastName)))")
    .order("createdAt", { ascending: false })
    .limit(40);

  if (error) throw new Error(`Could not list dispatch requests: ${error.message}`);
  return mapTowRequestRows((data ?? []) as AnyRow[]);
}

export async function assignDriverToRequest(supabase: SupabaseClient, input: DispatchAssignmentInput): Promise<DispatchRequestSummary> {
  const now = new Date().toISOString();
  const request = await supabase.from("tow_requests").select("id,status").eq("id", input.towRequestId).single();
  if (request.error) throw new Error(`Could not load request for assignment: ${request.error.message}`);

  const driver = await supabase.from("drivers").select("id,status").eq("id", input.driverId).single();
  if (driver.error) throw new Error(`Could not load provider for assignment: ${driver.error.message}`);
  if (!["APPROVED", "ONLINE", "OFFLINE"].includes(String(driver.data.status))) throw new Error("Provider must be approved before assignment.");

  const update = await supabase
    .from("tow_requests")
    .update({ driverId: input.driverId, status: "DRIVER_ASSIGNED", updatedAt: now })
    .eq("id", input.towRequestId);
  if (update.error) throw new Error(`Could not assign provider: ${update.error.message}`);

  await insertStatusUpdate(supabase, input.towRequestId, "DRIVER_ASSIGNED", "Provider assigned by dispatch.", now);
  const requests = await listDispatchRequests(supabase);
  const assigned = requests.find((candidate) => candidate.id === input.towRequestId);
  if (!assigned) throw new Error("Request assigned but could not be reloaded.");
  return assigned;
}

export async function listDriverJobs(supabase: SupabaseClient, driverId?: string): Promise<DispatchRequestSummary[]> {
  const query = supabase
    .from("tow_requests")
    .select("id,status,pickupAddress,dropoffAddress,totalCents,createdAt,service_types(code,name),customers(users(phone,profiles(firstName,lastName))),drivers(id,users(profiles(firstName,lastName)))")
    .not("driverId", "is", null)
    .order("createdAt", { ascending: false })
    .limit(30);
  const { data, error } = driverId ? await query.eq("driverId", driverId) : await query;
  if (error) throw new Error(`Could not list driver jobs: ${error.message}`);
  return mapTowRequestRows((data ?? []) as AnyRow[]);
}

export async function updateDriverJobStatus(supabase: SupabaseClient, input: DriverJobStatusInput): Promise<DispatchRequestSummary> {
  const now = new Date().toISOString();
  const request = await supabase.from("tow_requests").select("id,status").eq("id", input.towRequestId).single();
  if (request.error) throw new Error(`Could not load job: ${request.error.message}`);
  const currentStatus = String(request.data.status) as DbTowStatus;
  if (!isAllowedDriverStatusTransition(currentStatus, input.nextStatus)) {
    throw new Error(`Cannot move job from ${currentStatus} to ${input.nextStatus}.`);
  }

  const patch: Record<string, string> = { status: input.nextStatus, updatedAt: now };
  if (input.nextStatus === "COMPLETED") patch.completedAt = now;
  const update = await supabase.from("tow_requests").update(patch).eq("id", input.towRequestId);
  if (update.error) throw new Error(`Could not update job status: ${update.error.message}`);
  await insertStatusUpdate(supabase, input.towRequestId, input.nextStatus, statusMessageFor(input.nextStatus), now);

  const jobs = await listDriverJobs(supabase);
  const job = jobs.find((candidate) => candidate.id === input.towRequestId);
  if (!job) throw new Error("Job updated but could not be reloaded.");
  return job;
}

async function insertStatusUpdate(supabase: SupabaseClient, towRequestId: string, status: DbTowStatus, message: string, now: string) {
  const result = await supabase.from("tow_status_updates").insert({
    id: crypto.randomUUID(),
    towRequestId,
    status,
    message,
    createdAt: now,
  });
  if (result.error) throw new Error(`Could not record status update: ${result.error.message}`);
}

function firstNested(value: unknown): AnyRow | null {
  if (Array.isArray(value)) return (value[0] as AnyRow | undefined) ?? null;
  if (value && typeof value === "object") return value as AnyRow;
  return null;
}

function displayName(profile: AnyRow | null | undefined, fallback: string): string {
  const firstName = typeof profile?.firstName === "string" ? profile.firstName.trim() : "";
  const lastName = typeof profile?.lastName === "string" ? profile.lastName.trim() : "";
  return [firstName, lastName].filter(Boolean).join(" ") || fallback;
}
