import { NextResponse } from "next/server";
import { calculateQuote } from "@/features/pricing/pricing-engine";
import { quoteRequestSchema } from "@/features/tow-requests/schemas";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = quoteRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid quote request", issues: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json(calculateQuote(parsed.data));
}
