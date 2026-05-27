import { z } from "zod";
import { serviceTypeIds } from "./types";

export const quoteRequestSchema = z.object({
  serviceType: z.enum(serviceTypeIds),
  distanceMiles: z.coerce.number().min(0).max(500),
  afterHours: z.coerce.boolean().optional().default(false),
  heavyVehicle: z.coerce.boolean().optional().default(false),
  rush: z.coerce.boolean().optional().default(false),
});

export const towRequestSchema = z.object({
  customerName: z.string().min(2).max(120),
  phone: z.string().min(7).max(25),
  serviceType: z.enum(serviceTypeIds),
  pickupAddress: z.string().min(5).max(240),
  dropoffAddress: z.string().max(240).optional(),
  vehicleMake: z.string().min(2).max(80),
  vehicleModel: z.string().min(1).max(80),
  vehicleYear: z.string().max(12).optional(),
  vehicleColor: z.string().max(40).optional(),
  notes: z.string().max(800).optional(),
  heavyVehicle: z.coerce.boolean().optional().default(false),
  rush: z.coerce.boolean().optional().default(false),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type TowRequestInput = z.infer<typeof towRequestSchema>;
