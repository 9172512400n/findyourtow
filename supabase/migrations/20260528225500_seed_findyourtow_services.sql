-- Baseline service catalog and pricing for FindYourTow.
INSERT INTO public.service_types (id, code, name, description, active)
VALUES
  ('svc_standard_tow', 'STANDARD_TOW'::"ServiceTypeCode", 'Standard Tow', 'Everyday local tow for standard passenger vehicles.', true),
  ('svc_flatbed_tow', 'FLATBED_TOW'::"ServiceTypeCode", 'Flatbed Tow', 'Flatbed truck for AWD, luxury, damaged, or specialty vehicles.', true),
  ('svc_jump_start', 'JUMP_START'::"ServiceTypeCode", 'Jump Start', 'Battery boost when the vehicle will not start.', true),
  ('svc_flat_tire', 'FLAT_TIRE'::"ServiceTypeCode", 'Flat Tire', 'Spare tire install or tire help at the roadside.', true),
  ('svc_lockout', 'LOCKOUT'::"ServiceTypeCode", 'Lockout', 'Vehicle lockout help.', true),
  ('svc_fuel_delivery', 'FUEL_DELIVERY'::"ServiceTypeCode", 'Fuel Delivery', 'Emergency fuel delivery.', true),
  ('svc_winch_out', 'WINCH_OUT'::"ServiceTypeCode", 'Winch Out', 'Winch/recovery for stuck vehicles.', true),
  ('svc_accident_tow', 'ACCIDENT_TOW'::"ServiceTypeCode", 'Accident Tow', 'Tow after collision or unsafe-to-drive incident.', true),
  ('svc_vehicle_transport', 'VEHICLE_TRANSPORT'::"ServiceTypeCode", 'Vehicle Transport', 'Scheduled point-to-point vehicle transport.', true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  active = EXCLUDED.active;

INSERT INTO public.pricing_rules (
  id,
  "serviceTypeId",
  "baseFeeCents",
  "pricePerMileCents",
  "minimumCents",
  "afterHoursCents",
  "heavyVehicleCents",
  "rushCents",
  "adminFeeBps",
  active
)
VALUES
  ('price_standard_tow', 'svc_standard_tow', 9500, 500, 12500, 3500, 5000, 4000, 1000, true),
  ('price_flatbed_tow', 'svc_flatbed_tow', 13500, 650, 17500, 4500, 6500, 5000, 1000, true),
  ('price_jump_start', 'svc_jump_start', 6500, 0, 6500, 2500, 0, 2500, 1000, true),
  ('price_flat_tire', 'svc_flat_tire', 7500, 0, 7500, 2500, 0, 2500, 1000, true),
  ('price_lockout', 'svc_lockout', 7000, 0, 7000, 2500, 0, 2500, 1000, true),
  ('price_fuel_delivery', 'svc_fuel_delivery', 7500, 0, 7500, 2500, 0, 2500, 1000, true),
  ('price_winch_out', 'svc_winch_out', 15000, 750, 20000, 5000, 7500, 6000, 1000, true),
  ('price_accident_tow', 'svc_accident_tow', 16000, 700, 20000, 5000, 7500, 6000, 1000, true),
  ('price_vehicle_transport', 'svc_vehicle_transport', 18000, 800, 25000, 5000, 7500, 6000, 1000, true)
ON CONFLICT ("serviceTypeId") DO UPDATE SET
  "baseFeeCents" = EXCLUDED."baseFeeCents",
  "pricePerMileCents" = EXCLUDED."pricePerMileCents",
  "minimumCents" = EXCLUDED."minimumCents",
  "afterHoursCents" = EXCLUDED."afterHoursCents",
  "heavyVehicleCents" = EXCLUDED."heavyVehicleCents",
  "rushCents" = EXCLUDED."rushCents",
  "adminFeeBps" = EXCLUDED."adminFeeBps",
  active = EXCLUDED.active;
