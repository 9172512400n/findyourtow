import { NextResponse } from "next/server";
import { getBackendMode } from "@/lib/runtime/backend-mode";

export async function POST(request: Request) {
  const mode = getBackendMode();
  const body = await request.text();

  if (mode.demoMode) {
    return NextResponse.json({
      received: true,
      mode: "demo",
      note: "Stripe webhook placeholder accepted safely. Real signature verification turns on when Stripe env keys are configured.",
      bytes: body.length,
    });
  }

  // Future real Stripe webhook path:
  // - Verify stripe-signature with STRIPE_WEBHOOK_SECRET.
  // - On payment_intent.succeeded, update payments.status and tow_requests.status=PAID.
  // - On charge.refunded/refund.updated, update refunds and tow_requests.status=REFUNDED when applicable.
  return NextResponse.json({ received: true, mode: "configured_not_enabled" });
}
