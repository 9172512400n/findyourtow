import { NextResponse } from "next/server";
import { z } from "zod";
import { buildMockTrip } from "@/features/tow-requests/mock-data";
import { createDemoAuthorizationForStoredTowRequest, createPaymentIntentForTow } from "@/lib/stripe/payment-service";
import { getBackendMode } from "@/lib/runtime/backend-mode";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const paymentIntentSchema = z.object({
  towRequestId: z.string().min(3),
  amountCents: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = paymentIntentSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment intent request", issues: parsed.error.flatten() }, { status: 400 });
  }

  const mode = getBackendMode();
  const supabase = createServerSupabaseClient();
  if (mode.services.supabase && mode.paymentMode === "demo" && supabase) {
    try {
      return NextResponse.json(await createDemoAuthorizationForStoredTowRequest(supabase, parsed.data.towRequestId, parsed.data.amountCents));
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Could not authorize demo payment" }, { status: 500 });
    }
  }

  // Local fallback when the real marketplace backend is not configured.
  const trip = buildMockTrip({
    customerName: "Demo customer",
    phone: "+10000000000",
    serviceType: "standard_tow",
    pickupAddress: "Demo pickup",
    dropoffAddress: "Demo dropoff",
    vehicleMake: "Demo",
    vehicleModel: "Vehicle",
  });
  const intent = await createPaymentIntentForTow({ ...trip, id: parsed.data.towRequestId });

  return NextResponse.json(intent);
}
