export const vehicleTypes = ["Sedan", "SUV", "Pickup truck", "Van", "Motorcycle", "Box truck", "Heavy-duty vehicle"] as const;
export type VehicleType = (typeof vehicleTypes)[number];

export const heavyVehicleTypes = new Set<VehicleType>(["Pickup truck", "Van", "Box truck", "Heavy-duty vehicle"]);

export type VehicleProfile = {
  id: string;
  customerId?: string;
  nickname: string;
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vehicleType: VehicleType;
  vin?: string;
  photoUrl?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type VehicleSnapshot = {
  vehicleId?: string | null;
  nickname?: string;
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vehicleType: VehicleType;
  vin?: string;
  photoUrl?: string;
};

export type VehicleProfileInput = Omit<VehicleProfile, "id" | "createdAt" | "updatedAt"> & Partial<Pick<VehicleProfile, "id" | "createdAt" | "updatedAt">>;

export function isVehicleType(value: string): value is VehicleType {
  return vehicleTypes.includes(value as VehicleType);
}

export function normalizeVehicleType(value?: string): VehicleType {
  if (value && isVehicleType(value)) return value;
  if (value === "Sedan / small SUV") return "Sedan";
  if (value === "Large SUV") return "SUV";
  if (value === "Commercial vehicle") return "Box truck";
  return "Sedan";
}

export function isHeavyVehicleType(value?: string): boolean {
  return heavyVehicleTypes.has(normalizeVehicleType(value));
}

export function vehicleToSnapshot(vehicle: VehicleProfile): VehicleSnapshot {
  return {
    vehicleId: vehicle.id,
    nickname: vehicle.nickname,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    licensePlate: vehicle.licensePlate,
    vehicleType: vehicle.vehicleType,
    vin: vehicle.vin,
    photoUrl: vehicle.photoUrl,
  };
}

export function manualVehicleToSnapshot(input: {
  vehicleId?: string | null;
  nickname?: string;
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vehicleType: string;
  vin?: string;
  photoUrl?: string;
}): VehicleSnapshot {
  return {
    vehicleId: input.vehicleId ?? null,
    nickname: input.nickname?.trim() || undefined,
    make: input.make.trim(),
    model: input.model.trim(),
    year: input.year.trim(),
    color: input.color.trim(),
    licensePlate: input.licensePlate.trim(),
    vehicleType: normalizeVehicleType(input.vehicleType),
    vin: input.vin?.trim() || undefined,
    photoUrl: input.photoUrl?.trim() || undefined,
  };
}

export function sortVehiclesDefaultFirst(vehicles: VehicleProfile[]): VehicleProfile[] {
  return [...vehicles].sort((left, right) => {
    if (left.isDefault !== right.isDefault) return left.isDefault ? -1 : 1;
    return left.createdAt.localeCompare(right.createdAt);
  });
}
