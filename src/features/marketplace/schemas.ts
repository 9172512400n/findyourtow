import { z } from "zod";
import { serviceTypeIds } from "@/features/tow-requests/types";
import type { DbDriverStatus, DbTowStatus } from "./workflow";

export const providerApplicationSchema = z.object({
  providerType: z.enum(["COMPANY", "OWNER_OPERATOR"]).default("COMPANY"),
  companyName: z.string().min(2).max(140),
  contactName: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().min(7).max(25),
  businessAddress: z.string().min(5).max(220).optional(),
  serviceArea: z.string().min(2).max(160),
  truckType: z.string().min(2).max(80),
  plateNumber: z.string().min(2).max(40),
  services: z.array(z.enum(serviceTypeIds)).min(1).max(8),
  guidelinesVersion: z.string().min(3).max(80).default("provider-guidelines-v1"),
  agreementAccepted: z.boolean().default(false),
  signerName: z.string().min(2).max(120).optional(),
}).superRefine((value, context) => {
  if (!value.agreementAccepted) {
    context.addIssue({ code: "custom", path: ["agreementAccepted"], message: "Provider guidelines must be accepted before review." });
  }
});

export const driverApprovalSchema = z.object({
  driverId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED", "SUSPENDED"] satisfies DbDriverStatus[]),
});

export const dispatchAssignmentSchema = z.object({
  towRequestId: z.string().min(1),
  driverId: z.string().min(1),
});

export const driverJobStatusSchema = z.object({
  towRequestId: z.string().min(1),
  nextStatus: z.enum([
    "DRIVER_ON_THE_WAY",
    "DRIVER_ARRIVED",
    "VEHICLE_PICKED_UP",
    "IN_TRANSIT",
    "VEHICLE_DELIVERED",
    "COMPLETED",
  ] satisfies DbTowStatus[]),
});

export type ProviderApplicationInput = z.infer<typeof providerApplicationSchema>;
export type DriverApprovalInput = z.infer<typeof driverApprovalSchema>;
export type DispatchAssignmentInput = z.infer<typeof dispatchAssignmentSchema>;
export type DriverJobStatusInput = z.infer<typeof driverJobStatusSchema>;
