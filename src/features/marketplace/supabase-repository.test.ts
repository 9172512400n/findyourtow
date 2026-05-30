import { describe, expect, it } from "vitest";
import { mapDriverRows, mapTowRequestRows } from "./supabase-repository";

describe("marketplace Supabase row mappers", () => {
  it("maps provider rows into admin-friendly driver summaries", () => {
    const rows = mapDriverRows([
      {
        id: "driver_1",
        status: "PENDING_APPROVAL",
        rating: "5.00",
        approvedAt: null,
        createdAt: "2026-05-29T20:00:00.000Z",
        users: {
          email: "sam@example.com",
          phone: "+19172512400",
          profiles: { firstName: "Sam", lastName: "Driver" },
        },
        tow_trucks: [{ label: "North Shore Flatbed", truckType: "Flatbed", plateNumber: "TOW22", services: ["STANDARD_TOW", "FLATBED_TOW"] }],
      },
    ]);

    expect(rows).toEqual([
      expect.objectContaining({
        id: "driver_1",
        name: "Sam Driver",
        email: "sam@example.com",
        phone: "+19172512400",
        status: "PENDING_APPROVAL",
        truck: "North Shore Flatbed",
        services: ["standard_tow", "flatbed_tow"],
      }),
    ]);
  });

  it("maps tow request rows into dispatch queue summaries", () => {
    const rows = mapTowRequestRows([
      {
        id: "tow_123456789",
        status: "DRIVER_ASSIGNED",
        pickupAddress: "123 Main St",
        dropoffAddress: "Repair Shop",
        totalCents: 14740,
        createdAt: "2026-05-29T20:00:00.000Z",
        service_types: { code: "FLATBED_TOW", name: "Flatbed Tow" },
        customers: { users: { phone: "+1917", profiles: { firstName: "Nir", lastName: "M" } } },
        drivers: { id: "driver_1", users: { profiles: { firstName: "Sam", lastName: "Driver" } } },
      },
    ]);

    expect(rows[0]).toMatchObject({
      id: "tow_123456789",
      shortId: "TOW_1234",
      customer: "Nir M",
      service: "Flatbed Tow",
      status: "DRIVER_ASSIGNED",
      assignedDriver: "Sam Driver",
      totalCents: 14740,
    });
  });
});
