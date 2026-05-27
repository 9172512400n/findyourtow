import type { TowTrip } from "@/features/tow-requests/types";

export type DemoPaymentIntent = {
  id: string;
  clientSecret: string;
  status: "requires_payment_method" | "requires_confirmation" | "demo_authorized" | "demo_paid" | "demo_refunded";
  amountCents: number;
  currency: "usd";
  towRequestId: string;
};

export function createDemoPaymentIntent(trip: Pick<TowTrip, "id" | "quote">): DemoPaymentIntent {
  return {
    id: `pi_demo_${trip.id}`,
    clientSecret: `pi_demo_${trip.id}_secret_safe_demo`,
    status: "demo_authorized",
    amountCents: trip.quote.totalCents,
    currency: "usd",
    towRequestId: trip.id,
  };
}
