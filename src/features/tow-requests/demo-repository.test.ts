import { describe, expect, it } from "vitest";
import { createDemoTowRequest, findClosestDemoDrivers, getDemoTowRequest } from "./demo-repository";

describe("demo tow request repository", () => {
  it("saves vehicle, locations, price, payment status, and timeline in safe demo memory", async () => {
    const trip = await createDemoTowRequest({
      customerName: "Nir",
      phone: "+19172512400",
      serviceType: "flatbed_tow",
      pickupAddress: "350 5th Ave, New York, NY",
      dropoffAddress: "20 W 34th St, New York, NY",
      vehicleMake: "BMW",
      vehicleModel: "X5",
      vehicleYear: "2024",
      vehicleColor: "Black",
      rush: true,
    });

    const saved = getDemoTowRequest(trip.id);

    expect(saved?.vehicle.make).toBe("BMW");
    expect(saved?.pickup.address).toContain("350 5th");
    expect(saved?.dropoff?.address).toContain("20 W 34th");
    expect(saved?.quote.totalCents).toBeGreaterThan(0);
    expect(saved?.payment.status).toBe("demo_authorized");
    expect(saved?.timeline.map((item) => item.status)).toContain("awaiting_payment");
  });

  it("matches closest available drivers that can perform the requested service", () => {
    const matches = findClosestDemoDrivers("jump_start");

    expect(matches[0].services).toContain("jump_start");
    expect(matches[0].distanceMiles).toBeLessThanOrEqual(matches.at(-1)?.distanceMiles ?? 999);
  });
});
