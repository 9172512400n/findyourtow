// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

const legacyStoragePayload = (pickupAddress: string, dropoffAddress = "Trusted repair shop · Long Island City") => JSON.stringify({
  state: {
    data: {
      serviceType: "jump_start",
      pickupAddress,
      dropoffAddress,
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      vehicleColor: "",
      licensePlate: "",
      vehicleType: "Sedan",
      vehicleId: null,
      vehicleNickname: "",
      vehicleVin: "",
      vehiclePhotoUrl: "",
      vehicleSnapshot: null,
      saveVehicleToProfile: false,
      notes: "",
      rush: false,
      photoAttached: false,
      paymentStatus: "authorized",
    },
  },
  version: 0,
});

function installLocalStorageMock() {
  const values = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
      clear: () => values.clear(),
    },
  });
}

describe("request flow store persistence privacy scrub", () => {
  beforeEach(() => {
    vi.resetModules();
    installLocalStorageMock();
    window.localStorage.clear();
  });

  it("scrubs old real-world persisted pickup and dropoff samples during hydration", async () => {
    window.localStorage.setItem(
      "findyourtow-request-flow-v1",
      legacyStoragePayload("Current location · New York, NY, United States"),
    );

    const { useRequestFlowStore } = await import("./request-flow-store");

    expect(useRequestFlowStore.getState().data.pickupAddress).toBe("Current location · Demo Springs");
    expect(useRequestFlowStore.getState().data.dropoffAddress).toBe("Trusted repair shop · 2200 Mockingbird Ct");
  });
});
