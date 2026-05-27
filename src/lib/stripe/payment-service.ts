import Stripe from "stripe";
import { getBackendMode } from "@/lib/runtime/backend-mode";
import { createDemoPaymentIntent } from "@/features/payments/payment-simulator";
import type { TowTrip } from "@/features/tow-requests/types";

export async function createPaymentIntentForTow(trip: TowTrip) {
  const mode = getBackendMode();
  if (mode.demoMode || !process.env.STRIPE_SECRET_KEY) {
    return createDemoPaymentIntent(trip);
  }

  // Real Stripe connection point. Keep this isolated so the UI can stay stable
  // while production credentials are added later.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const intent = await stripe.paymentIntents.create({
    amount: trip.quote.totalCents,
    currency: "usd",
    metadata: { towRequestId: trip.id, serviceType: trip.quote.serviceType },
    automatic_payment_methods: { enabled: true },
  });

  return {
    id: intent.id,
    clientSecret: intent.client_secret ?? "",
    status: intent.status,
    amountCents: intent.amount,
    currency: "usd" as const,
    towRequestId: trip.id,
  };
}
