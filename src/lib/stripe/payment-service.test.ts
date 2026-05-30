import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TowTrip } from "@/features/tow-requests/types";

const stripeCreatePaymentIntent = vi.hoisted(() => vi.fn());

vi.mock("stripe", () => ({
  default: vi.fn(function StripeMock() {
    return { paymentIntents: { create: stripeCreatePaymentIntent } };
  }),
}));

import { createDemoAuthorizationForStoredTowRequest, createPaymentIntentForStoredTowRequest, createPaymentIntentForTow } from "./payment-service";

function createPaymentSupabaseSpy() {
  const selectTow = vi.fn(() => ({ eq: () => ({ single: async () => ({ data: { id: "tow_123", totalCents: 14740, service_types: { code: "STANDARD_TOW" } }, error: null }) }) }));
  const upsertPayment = vi.fn(() => ({ error: null }));
  const updateTow = vi.fn(() => ({ eq: () => ({ error: null }) }));
  const insertTimeline = vi.fn(() => ({ error: null }));
  const from = vi.fn((table: string) => {
    if (table === "tow_requests") {
      return {
        select: selectTow,
        update: updateTow,
      };
    }
    if (table === "payments") return { upsert: upsertPayment };
    if (table === "tow_status_updates") return { insert: insertTimeline };
    throw new Error(`Unexpected table ${table}`);
  });
  return { supabase: { from }, upsertPayment, updateTow, insertTimeline };
}

const trip = {
  id: "tow_123",
  quote: { totalCents: 14740, serviceType: "standard_tow" },
} as TowTrip;

beforeEach(() => {
  stripeCreatePaymentIntent.mockReset();
});

describe("createPaymentIntentForTow", () => {
  it("refuses to create fake payment authorizations when Stripe is not configured", async () => {
    await expect(createPaymentIntentForTow(trip, {})).rejects.toThrow(/Stripe is required for real payment authorization/i);
  });
});

describe("createPaymentIntentForStoredTowRequest", () => {
  it("creates a real manual-capture Stripe intent from the stored tow request amount", async () => {
    stripeCreatePaymentIntent.mockResolvedValue({
      id: "pi_real_123",
      client_secret: "pi_real_123_secret",
      status: "requires_payment_method",
      amount: 14740,
      currency: "usd",
    });
    const { supabase, upsertPayment, insertTimeline } = createPaymentSupabaseSpy();

    const intent = await createPaymentIntentForStoredTowRequest(supabase as never, "tow_123", { STRIPE_SECRET_KEY: "sk_test_real" });

    expect(stripeCreatePaymentIntent).toHaveBeenCalledWith(expect.objectContaining({
      amount: 14740,
      currency: "usd",
      capture_method: "manual",
      metadata: { towRequestId: "tow_123", serviceType: "STANDARD_TOW" },
    }));
    expect(intent).toEqual(expect.objectContaining({
      id: "pi_real_123",
      clientSecret: "pi_real_123_secret",
      status: "requires_payment_method",
      amountCents: 14740,
      towRequestId: "tow_123",
    }));
    expect(upsertPayment).toHaveBeenCalledWith(expect.objectContaining({
      towRequestId: "tow_123",
      stripePaymentIntentId: "pi_real_123",
      status: "REQUIRES_CONFIRMATION",
      amountCents: 14740,
    }), { onConflict: "towRequestId" });
    expect(insertTimeline).toHaveBeenCalledWith(expect.objectContaining({
      towRequestId: "tow_123",
      status: "AWAITING_PAYMENT",
    }));
  });
});

describe("createDemoAuthorizationForStoredTowRequest", () => {
  it("keeps Stripe simulated while persisting real payment and request lifecycle rows", async () => {
    const { supabase, upsertPayment, updateTow, insertTimeline } = createPaymentSupabaseSpy();

    const intent = await createDemoAuthorizationForStoredTowRequest(supabase as never, "tow_123");

    expect(intent.status).toBe("demo_authorized");
    expect(intent.towRequestId).toBe("tow_123");
    expect(upsertPayment).toHaveBeenCalledWith(expect.objectContaining({
      towRequestId: "tow_123",
      stripePaymentIntentId: "pi_demo_tow_123",
      status: "SUCCEEDED",
      amountCents: 14740,
    }), { onConflict: "towRequestId" });
    expect(updateTow).toHaveBeenCalledWith(expect.objectContaining({ status: "PAID" }));
    expect(insertTimeline).toHaveBeenCalledWith(expect.objectContaining({ towRequestId: "tow_123", status: "PAID" }));
  });
});
