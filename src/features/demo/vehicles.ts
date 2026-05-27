export type DemoVehicle = {
  make: string;
  model: string;
  year: string;
  color: string;
  plate?: string;
};

// Safe sample vehicles for dashboards and demos. Real data is saved per tow request.
export const demoVehicles: DemoVehicle[] = [
  { make: "Mercedes-Benz", model: "GLE", year: "2024", color: "Black" },
  { make: "BMW", model: "X5", year: "2023", color: "White" },
  { make: "Tesla", model: "Model 3", year: "2022", color: "Midnight Silver" },
];
