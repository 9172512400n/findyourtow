import { serviceTypeIdToDbCode } from "@/features/tow-requests/supabase-repository";
import type { ServiceTypeId } from "@/features/tow-requests/types";

export type DbDriverStatus = "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "ONLINE" | "OFFLINE" | "BUSY" | "SUSPENDED";

export type DbTowStatus =
  | "QUOTE_CREATED"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "SEARCHING_FOR_DRIVER"
  | "DRIVER_ASSIGNED"
  | "DRIVER_ON_THE_WAY"
  | "DRIVER_ARRIVED"
  | "VEHICLE_PICKED_UP"
  | "IN_TRANSIT"
  | "VEHICLE_DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type ProviderApplicationInput = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  serviceArea: string;
  truckType: string;
  plateNumber: string;
  services: ServiceTypeId[];
};

export type NormalizedProviderApplication = ProviderApplicationInput & {
  email: string;
  phone: string;
  plateNumber: string;
  status: "PENDING_APPROVAL";
};

export function normalizeProviderPhone(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "+10000000000";
  if (trimmed.startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

export function normalizeProviderApplication(input: ProviderApplicationInput): NormalizedProviderApplication {
  return {
    companyName: input.companyName.trim(),
    contactName: input.contactName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: normalizeProviderPhone(input.phone),
    serviceArea: input.serviceArea.trim(),
    truckType: input.truckType.trim(),
    plateNumber: input.plateNumber.trim().toUpperCase(),
    services: input.services,
    status: "PENDING_APPROVAL",
  };
}

export function splitContactName(contactName: string) {
  const parts = contactName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "Provider",
    lastName: parts.slice(1).join(" ") || "Operator",
  };
}

export function buildProviderApplicationRecord(input: {
  now: string;
  userId: string;
  profileId: string;
  driverId: string;
  truckId: string;
  input: ProviderApplicationInput;
}) {
  const normalized = normalizeProviderApplication(input.input);
  const name = splitContactName(normalized.contactName);

  return {
    user: {
      id: input.userId,
      email: normalized.email,
      phone: normalized.phone,
      role: "DRIVER" as const,
      createdAt: input.now,
      updatedAt: input.now,
    },
    profile: {
      id: input.profileId,
      userId: input.userId,
      firstName: name.firstName,
      lastName: name.lastName,
      createdAt: input.now,
      updatedAt: input.now,
    },
    driver: {
      id: input.driverId,
      userId: input.userId,
      status: normalized.status,
      createdAt: input.now,
      updatedAt: input.now,
    },
    truck: {
      id: input.truckId,
      driverId: input.driverId,
      label: `${normalized.companyName} ${normalized.truckType}`,
      plateNumber: normalized.plateNumber,
      truckType: normalized.truckType,
      active: true,
      photos: [],
      services: normalized.services.map(serviceTypeIdToDbCode),
    },
    metadata: {
      companyName: normalized.companyName,
      serviceArea: normalized.serviceArea,
    },
  };
}

const nextStatusByCurrent: Partial<Record<DbTowStatus, DbTowStatus[]>> = {
  DRIVER_ASSIGNED: ["DRIVER_ON_THE_WAY"],
  DRIVER_ON_THE_WAY: ["DRIVER_ARRIVED"],
  DRIVER_ARRIVED: ["VEHICLE_PICKED_UP"],
  VEHICLE_PICKED_UP: ["IN_TRANSIT", "COMPLETED"],
  IN_TRANSIT: ["VEHICLE_DELIVERED"],
  VEHICLE_DELIVERED: ["COMPLETED"],
};

const actionLabels: Partial<Record<DbTowStatus, string>> = {
  DRIVER_ASSIGNED: "Accept / en route",
  DRIVER_ON_THE_WAY: "Mark arrived",
  DRIVER_ARRIVED: "Vehicle picked up",
  VEHICLE_PICKED_UP: "Start transport / complete roadside",
  IN_TRANSIT: "Vehicle delivered",
  VEHICLE_DELIVERED: "Complete job",
};

export function allowedNextStatuses(status: DbTowStatus): DbTowStatus[] {
  return nextStatusByCurrent[status] ?? [];
}

export function isAllowedDriverStatusTransition(current: DbTowStatus, next: DbTowStatus): boolean {
  return allowedNextStatuses(current).includes(next);
}

export function dbStatusToDriverAction(status: DbTowStatus): { nextStatus: DbTowStatus; label: string } | null {
  const [nextStatus] = allowedNextStatuses(status);
  if (!nextStatus) return null;
  return { nextStatus, label: actionLabels[status] ?? "Update job" };
}

export function statusMessageFor(status: DbTowStatus): string {
  const messages: Record<DbTowStatus, string> = {
    QUOTE_CREATED: "Quote created.",
    AWAITING_PAYMENT: "Awaiting payment authorization.",
    PAID: "Payment authorized.",
    SEARCHING_FOR_DRIVER: "Searching for a provider.",
    DRIVER_ASSIGNED: "Provider assigned.",
    DRIVER_ON_THE_WAY: "Provider accepted and is en route.",
    DRIVER_ARRIVED: "Provider arrived at pickup.",
    VEHICLE_PICKED_UP: "Vehicle picked up.",
    IN_TRANSIT: "Vehicle is in transit.",
    VEHICLE_DELIVERED: "Vehicle delivered.",
    COMPLETED: "Job completed.",
    CANCELLED: "Job cancelled.",
    REFUNDED: "Job refunded.",
  };
  return messages[status];
}
