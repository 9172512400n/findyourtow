import { NextResponse } from "next/server";
import { z } from "zod";
import { buildMockTrip } from "@/features/tow-requests/mock-data";
import { createPaymentIntentForTow } from "@/lib/stripe/payment-service";

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

  // Demo fallback. Real mode will fetch the tow request from Supabase and create
  // a Stripe PaymentIntent before allowing dispatch.
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
