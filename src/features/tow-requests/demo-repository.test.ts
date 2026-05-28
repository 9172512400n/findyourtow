import { describe, expect, it } from "vitest";
import { createDemoTowRequest, findClosestDemoDrivers, getDemoTowRequest } from "./demo-repository";

describe("demo tow request repository", () => {
  it("saves vehicle, locations, price, payment status, and timeline in safe demo memory", async () => {
    const trip = await createDemoTowRequest({
      customerName: "Demo Customer",
      phone: "+1000010100",
      serviceType: "flatbed_tow",
      pickupAddress: "7148 Pixel Pkwy, Demo Springs",
      dropoffAddress: "2200 Mockingbird Ct, Demo Springs",
      vehicleMake: "BMW",
      vehicleModel: "X5",
      vehicleYear: "2024",
      vehicleColor: "Black",
      rush: true,
      vehicleId: "veh_saved_bmw",
      vehicleSnapshot: {
        vehicleId: "veh_saved_bmw",
        nickname: "Daily SUV",
        make: "BMW",
        model: "X5",
        year: "2024",
        color: "Black",
        licensePlate: "NYX5",
        vehicleType: "SUV",
      },
    });

    const saved = getDemoTowRequest(trip.id);

    expect(saved?.vehicleId).toBe("veh_saved_bmw");
    expect(saved?.vehicleSnapshot).toMatchObject({ make: "BMW", model: "X5", vehicleType: "SUV" });
    expect(saved?.vehicle.make).toBe("BMW");
    expect(saved?.pickup.address).toContain("7148 Pixel Pkwy");
    expect(saved?.dropoff?.address).toContain("2200 Mockingbird Ct");
    expect(saved?.quote.totalCents).toBeGreaterThan(0);
    expect(saved?.payment.status).toBe("demo_authorized");
    expect(saved?.timeline.map((item) => item.status)).toContain("awaiting_payment");
  });

  it("stores manual one-off vehicle snapshots without requiring a saved vehicle id", async () => {
    const snapshot = {
      make: "Honda",
      model: "Civic",
      year: "2018",
      color: "Blue",
      licensePlate: "FRIEND1",
      vehicleType: "Sedan" as const,
    };

    const trip = await createDemoTowRequest({
      customerName: "Demo Customer",
      phone: "+1000010100",
      serviceType: "standard_tow",
      pickupAddress: "Random Auto Center",
      dropoffAddress: "Placeholder Blvd",
      vehicleMake: "Honda",
      vehicleModel: "Civic",
      vehicleYear: "2018",
      vehicleColor: "Blue",
      vehicleId: null,
      vehicleSnapshot: snapshot,
    });

    snapshot.color = "Changed after request";

    const saved = getDemoTowRequest(trip.id);
    expect(saved?.vehicleId).toBeNull();
    expect(saved?.vehicleSnapshot).toMatchObject({ color: "Blue", licensePlate: "FRIEND1" });
  });

  it("matches closest available drivers that can perform the requested service", () => {
    const matches = findClosestDemoDrivers("jump_start");

    expect(matches[0].services).toContain("jump_start");
    expect(matches[0].distanceMiles).toBeLessThanOrEqual(matches.at(-1)?.distanceMiles ?? 999);
  });
});
