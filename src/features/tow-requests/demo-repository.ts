import { demoDrivers } from "@/features/demo/drivers";
import { demoJobStatuses } from "@/features/demo/job-statuses";
import { createDemoPaymentIntent, type DemoPaymentIntent } from "@/features/payments/payment-simulator";
import { calculateQuote } from "@/features/pricing/pricing-engine";
import { estimateRoute } from "@/lib/mapbox/mapbox-service";
import type { AvailableDriver, ServiceTypeId, TowRequestPayload, TowTrip } from "./types";

export type DemoTowRecord = TowTrip & {
  customer: { name: string; phone: string };
  vehicle: { make: string; model: string; year?: string; color?: string };
  pickup: TowTrip["pickup"] & { address: string };
  dropoff?: TowTrip["dropoff"] & { address: string };
  payment: DemoPaymentIntent;
  backendProvider: "demo";
};

const demoTowRequests = new Map<string, DemoTowRecord>();

export async function createDemoTowRequest(payload: TowRequestPayload): Promise<DemoTowRecord> {
  const routeEstimate = await estimateRoute(payload.pickupAddress, payload.dropoffAddress);
  const quote = calculateQuote({
    serviceType: payload.serviceType,
    distanceMiles: routeEstimate.distanceMiles,
    heavyVehicle: payload.heavyVehicle,
    rush: payload.rush,
  });
  const driver = findClosestDemoDrivers(payload.serviceType)[0] ?? demoDrivers[0];
  const now = new Date();
  const id = `tow_${now.getTime()}`;
  const timeline = demoJobStatuses
    .filter((item) => ["quote_created", "awaiting_payment", "paid", "searching_for_driver", "driver_assigned", "driver_on_the_way", "completed"].includes(item.status))
    .map((item, index) => ({
      status: item.status,
      label: item.status === "driver_assigned" ? `${driver.name} assigned` : item.label,
      timestamp: new Date(now.getTime() + index * 60_000).toISOString(),
      complete: index <= 3,
    }));

  const trip: TowTrip = {
    id,
    status: "searching_for_driver",
    quote,
    pickupAddress: payload.pickupAddress,
    dropoffAddress: payload.dropoffAddress,
    driver: { ...driver, status: "assigned" },
    pickup: routeEstimate.pickup,
    dropoff: routeEstimate.dropoff,
    route: routeEstimate.route,
    timeline,
  };
  const payment = createDemoPaymentIntent(trip);
  const record: DemoTowRecord = {
    ...trip,
    customer: { name: payload.customerName, phone: payload.phone },
    vehicle: {
      make: payload.vehicleMake,
      model: payload.vehicleModel,
      year: payload.vehicleYear,
      color: payload.vehicleColor,
    },
    pickup: { ...routeEstimate.pickup, address: payload.pickupAddress },
    dropoff: { ...routeEstimate.dropoff, address: payload.dropoffAddress ?? "Service location only" },
    payment,
    backendProvider: "demo",
  };

  demoTowRequests.set(id, record);
  return record;
}

export function getDemoTowRequest(id: string): DemoTowRecord | undefined {
  return demoTowRequests.get(id);
}

export function findClosestDemoDrivers(serviceType: ServiceTypeId): AvailableDriver[] {
  return demoDrivers
    .filter((driver) => driver.status !== "busy" && driver.services.includes(serviceType))
    .sort((left, right) => left.distanceMiles - right.distanceMiles);
}

export function assignDemoDriver(towRequestId: string, driverId: string): DemoTowRecord | undefined {
  const record = demoTowRequests.get(towRequestId);
  const driver = demoDrivers.find((candidate) => candidate.id === driverId);
  if (!record || !driver) return undefined;

  const updated: DemoTowRecord = {
    ...record,
    status: "driver_assigned",
    driver: { ...driver, status: "assigned" },
    timeline: record.timeline.map((item) => item.status === "driver_assigned" ? { ...item, complete: true, label: `${driver.name} assigned manually` } : item),
  };
  demoTowRequests.set(towRequestId, updated);
  return updated;
}
