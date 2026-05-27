import type { TowStatus } from "@/features/tow-requests/types";

export type DemoRequestSummary = {
  id: string;
  service: string;
  date: string;
  status: TowStatus | "refunded_label";
  paymentStatus: "demo_authorized" | "demo_paid" | "demo_refunded";
  totalCents: number;
};

export const demoRequestHistory: DemoRequestSummary[] = [
  { id: "tow_82910", service: "Jump start", date: "May 21", status: "completed", paymentStatus: "demo_paid", totalCents: 9350 },
  { id: "tow_81442", service: "Flat tire", date: "May 12", status: "completed", paymentStatus: "demo_paid", totalCents: 10450 },
  { id: "tow_80118", service: "Lockout", date: "Apr 28", status: "refunded_label", paymentStatus: "demo_refunded", totalCents: 8800 },
];
