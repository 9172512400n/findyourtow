import { describe, expect, it, vi } from "vitest";
import { createDemoAuthorizationForStoredTowRequest } from "./payment-service";

function createPaymentSupabaseSpy() {
  const selectTow = vi.fn(() => ({ eq: () => ({ single: async () => ({ data: { id: "tow_123", totalCents: 14740 }, error: null }) }) }));
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
