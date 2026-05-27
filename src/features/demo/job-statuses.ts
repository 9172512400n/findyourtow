import type { TowStatus } from "@/features/tow-requests/types";

export const demoJobStatuses: Array<{ status: TowStatus; label: string; customerVisible: boolean }> = [
  { status: "quote_created", label: "Quote created", customerVisible: true },
  { status: "awaiting_payment", label: "Awaiting secure payment", customerVisible: true },
  { status: "paid", label: "Payment authorized", customerVisible: true },
  { status: "searching_for_driver", label: "Searching for closest driver", customerVisible: true },
  { status: "driver_assigned", label: "Driver assigned", customerVisible: true },
  { status: "driver_on_the_way", label: "Driver on the way", customerVisible: true },
  { status: "driver_arrived", label: "Driver arrived", customerVisible: true },
  { status: "vehicle_picked_up", label: "Vehicle picked up", customerVisible: true },
  { status: "in_transit", label: "In transit", customerVisible: true },
  { status: "vehicle_delivered", label: "Vehicle delivered", customerVisible: true },
  { status: "completed", label: "Completed", customerVisible: true },
  { status: "cancelled", label: "Cancelled", customerVisible: true },
  { status: "refunded", label: "Refunded", customerVisible: true },
];
