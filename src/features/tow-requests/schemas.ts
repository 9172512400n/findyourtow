import { z } from "zod";
import { vehicleTypes } from "@/features/vehicles/types";
import { serviceTypeIds } from "./types";

export const quoteRequestSchema = z.object({
  serviceType: z.enum(serviceTypeIds),
  distanceMiles: z.coerce.number().min(0).max(500),
  afterHours: z.coerce.boolean().optional().default(false),
  heavyVehicle: z.coerce.boolean().optional().default(false),
  vehicleType: z.enum(vehicleTypes).optional(),
  rush: z.coerce.boolean().optional().default(false),
});

const vehicleSnapshotSchema = z.object({
  vehicleId: z.string().nullable().optional(),
  nickname: z.string().optional(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.string(),
  color: z.string(),
  licensePlate: z.string(),
  vehicleType: z.enum(vehicleTypes),
  vin: z.string().optional(),
  photoUrl: z.string().optional(),
});

export const towRequestSchema = z.object({
  customerName: z.string().min(2).max(120),
  phone: z.string().min(7).max(25),
  serviceType: z.enum(serviceTypeIds),
  pickupAddress: z.string().min(5).max(240),
  dropoffAddress: z.string().max(240).optional(),
  vehicleId: z.string().nullable().optional(),
  vehicleSnapshot: vehicleSnapshotSchema.optional(),
  vehicleMake: z.string().min(2).max(80),
  vehicleModel: z.string().min(1).max(80),
  vehicleYear: z.string().max(12).optional(),
  vehicleColor: z.string().max(40).optional(),
  licensePlate: z.string().max(40).optional(),
  vehicleType: z.enum(vehicleTypes).optional(),
  notes: z.string().max(800).optional(),
  heavyVehicle: z.coerce.boolean().optional().default(false),
  rush: z.coerce.boolean().optional().default(false),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type TowRequestInput = z.infer<typeof towRequestSchema>;
