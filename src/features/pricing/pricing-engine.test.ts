import { describe, expect, it } from "vitest";
import { calculateQuote } from "./pricing-engine";

describe("calculateQuote", () => {
  it("calculates a standard tow with base, per-mile distance, minimum tow, and admin fee", () => {
    const quote = calculateQuote({ serviceType: "standard_tow", distanceMiles: 4 });

    expect(quote.subtotalCents).toBe(12500);
    expect(quote.adminFeeCents).toBe(1250);
    expect(quote.totalCents).toBe(13750);
    expect(quote.lineItems.map((item) => item.code)).toEqual([
      "base_fee",
      "distance_fee",
      "minimum_adjustment",
      "admin_service_fee",
    ]);
  });

  it("adds after-hours, heavy vehicle, and rush fees", () => {
    const quote = calculateQuote({
      serviceType: "flatbed_tow",
      distanceMiles: 12,
      afterHours: true,
      heavyVehicle: true,
      rush: true,
    });

    expect(quote.subtotalCents).toBe(31000);
    expect(quote.totalCents).toBe(34100);
    expect(quote.lineItems.map((item) => item.code)).toContain("after_hours_fee");
    expect(quote.lineItems.map((item) => item.code)).toContain("heavy_vehicle_fee");
    expect(quote.lineItems.map((item) => item.code)).toContain("rush_fee");
  });

  it("does not apply tow minimum to jump start service", () => {
    const quote = calculateQuote({ serviceType: "jump_start", distanceMiles: 2 });

    expect(quote.subtotalCents).toBe(8500);
    expect(quote.totalCents).toBe(9350);
    expect(quote.lineItems.map((item) => item.code)).not.toContain("minimum_adjustment");
  });
});
