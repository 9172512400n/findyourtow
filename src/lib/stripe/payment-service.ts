import Stripe from "stripe";
import { getBackendMode } from "@/lib/runtime/backend-mode";
import { createDemoPaymentIntent } from "@/features/payments/payment-simulator";
import type { TowTrip } from "@/features/tow-requests/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type StoredTowPaymentIntent = Awaited<ReturnType<typeof createDemoPaymentIntent>>;

export async function createPaymentIntentForTow(trip: TowTrip) {
  const mode = getBackendMode();
  if (mode.paymentMode === "demo" || !process.env.STRIPE_SECRET_KEY) {
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

export async function createDemoAuthorizationForStoredTowRequest(supabase: SupabaseClient, towRequestId: string, amountOverrideCents?: number): Promise<StoredTowPaymentIntent> {
  const now = new Date().toISOString();
  const loaded = await supabase.from("tow_requests").select("id,totalCents").eq("id", towRequestId).single();
  if (loaded.error) throw new Error(`Could not load tow request for payment authorization: ${loaded.error.message}`);
  const totalCents = amountOverrideCents ?? Number((loaded.data as { totalCents?: number } | null)?.totalCents ?? 0);
  if (!totalCents) throw new Error("Tow request does not have a valid total for payment authorization.");

  const intent = createDemoPaymentIntent({ id: towRequestId, quote: { totalCents } } as TowTrip);

  const payment = await supabase.from("payments").upsert({
    id: crypto.randomUUID(),
    towRequestId,
    stripePaymentIntentId: intent.id,
    status: "SUCCEEDED",
    amountCents: totalCents,
    currency: "usd",
    createdAt: now,
    updatedAt: now,
  }, { onConflict: "towRequestId" });
  if (payment.error) throw new Error(`Could not record demo payment authorization: ${payment.error.message}`);

  const request = await supabase.from("tow_requests").update({ status: "PAID", updatedAt: now }).eq("id", towRequestId);
  if (request.error) throw new Error(`Could not mark tow request paid: ${request.error.message}`);

  const timeline = await supabase.from("tow_status_updates").insert({
    id: crypto.randomUUID(),
    towRequestId,
    status: "PAID",
    message: "Payment authorized with the demo payment adapter. Stripe connection is pending.",
    createdAt: now,
  });
  if (timeline.error) throw new Error(`Could not record payment timeline update: ${timeline.error.message}`);

  return intent;
}
