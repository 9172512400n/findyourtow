import { describe, expect, it } from "vitest";
import { dbServiceCodeToServiceTypeId, normalizeGuestPhone, serviceTypeIdToDbCode } from "./supabase-repository";
import { serviceTypeIds } from "./types";

describe("Supabase tow request repository helpers", () => {
  it("maps every app service id to a database service code", () => {
    expect(serviceTypeIds.map((id) => serviceTypeIdToDbCode(id))).toEqual([
      "STANDARD_TOW",
      "FLATBED_TOW",
      "JUMP_START",
      "FLAT_TIRE",
      "LOCKOUT",
      "FUEL_DELIVERY",
      "WINCH_OUT",
      "ACCIDENT_TOW",
      "MOTORCYCLE_TOW",
      "BATTERY_HELP",
      "VEHICLE_TRANSPORT",
      "HEAVY_DUTY_TOW",
      "BOX_TRUCK_TOW",
      "PRIVATE_PROPERTY_TOW",
      "EMERGENCY_ROADSIDE",
    ]);
  });

  it("maps database service codes back to app service ids", () => {
    expect(dbServiceCodeToServiceTypeId("HEAVY_DUTY_TOW")).toBe("heavy_duty_tow");
    expect(dbServiceCodeToServiceTypeId("EMERGENCY_ROADSIDE")).toBe("emergency_roadside");
  });

  it("normalizes guest phone numbers for stable lookup", () => {
    expect(normalizeGuestPhone("(917) 251-2400")).toBe("+19172512400");
    expect(normalizeGuestPhone("+44 20 1234 5678")).toBe("+442012345678");
  });
});
