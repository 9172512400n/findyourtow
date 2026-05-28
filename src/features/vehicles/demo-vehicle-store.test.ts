// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { createDemoVehicleStore, demoVehicleSeed } from "./demo-vehicle-store";
import { vehicleToSnapshot } from "./types";

describe("demo vehicle store", () => {
  beforeEach(() => {
    window.localStorage?.clear?.();
  });

  it("starts with demo vehicles sorted with the default first", () => {
    const store = createDemoVehicleStore();
    const vehicles = store.getVehicles();

    expect(vehicles).toHaveLength(3);
    expect(vehicles[0]).toMatchObject({ make: "Toyota", model: "Camry", year: "2021", color: "Black", isDefault: true });
    expect(vehicles.map((vehicle) => `${vehicle.year} ${vehicle.make} ${vehicle.model}`)).toEqual([
      "2021 Toyota Camry",
      "2023 Ford F-150",
      "2020 Honda Accord",
    ]);
  });

  it("adds, edits, deletes, and promotes one default vehicle", () => {
    const store = createDemoVehicleStore();

    const tesla = store.addVehicle({
      nickname: "EV",
      make: "Tesla",
      model: "Model Y",
      year: "2024",
      color: "Blue",
      licensePlate: "EV123",
      vehicleType: "SUV",
      isDefault: true,
    });

    expect(store.getVehicles()[0].id).toBe(tesla.id);
    expect(store.getVehicles().filter((vehicle) => vehicle.isDefault)).toHaveLength(1);

    store.updateVehicle(tesla.id, { color: "Red", nickname: "Updated EV" });
    expect(store.getVehicle(tesla.id)).toMatchObject({ color: "Red", nickname: "Updated EV" });

    store.deleteVehicle(tesla.id);
    expect(store.getVehicle(tesla.id)).toBeUndefined();
    expect(store.getVehicles()[0]).toMatchObject({ make: "Toyota", isDefault: true });
  });

  it("creates immutable request snapshots from vehicle profiles", () => {
    const vehicle = { ...demoVehicleSeed[0] };
    const snapshot = vehicleToSnapshot(vehicle);

    vehicle.color = "Purple";

    expect(snapshot).toMatchObject({ make: "Toyota", model: "Camry", color: "Black", vehicleType: "Sedan" });
  });
});
