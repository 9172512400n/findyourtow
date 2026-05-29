-- Seed extended FindYourTow services after enum labels exist.
INSERT INTO public.service_types (id, code, name, description, active)
VALUES
  ('svc_motorcycle_tow', 'MOTORCYCLE_TOW'::"ServiceTypeCode", 'Motorcycle Tow', 'Motorcycle-safe towing and transport.', true),
  ('svc_battery_help', 'BATTERY_HELP'::"ServiceTypeCode", 'Battery Help', 'Battery testing, jump help, and battery-related roadside support.', true),
  ('svc_heavy_duty_tow', 'HEAVY_DUTY_TOW'::"ServiceTypeCode", 'Heavy-Duty Tow', 'Heavy-duty tow support for larger vehicles.', true),
  ('svc_box_truck_tow', 'BOX_TRUCK_TOW'::"ServiceTypeCode", 'Box Truck Tow', 'Tow support for box trucks and commercial vehicles.', true),
  ('svc_private_property_tow', 'PRIVATE_PROPERTY_TOW'::"ServiceTypeCode", 'Private Property Tow', 'Private property and impound-style tow coordination.', true),
  ('svc_emergency_roadside', 'EMERGENCY_ROADSIDE'::"ServiceTypeCode", 'Emergency Roadside Help', 'General emergency roadside assistance.', true)
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
  ('price_motorcycle_tow', 'svc_motorcycle_tow', 11000, 500, 12500, 3500, 2500, 4000, 1000, true),
  ('price_battery_help', 'svc_battery_help', 9500, 0, 9500, 2500, 0, 2500, 1000, true),
  ('price_heavy_duty_tow', 'svc_heavy_duty_tow', 24500, 900, 24500, 6500, 8000, 6500, 1000, true),
  ('price_box_truck_tow', 'svc_box_truck_tow', 26500, 900, 26500, 6500, 8000, 6500, 1000, true),
  ('price_private_property_tow', 'svc_private_property_tow', 15500, 500, 15500, 3500, 5000, 4000, 1000, true),
  ('price_emergency_roadside', 'svc_emergency_roadside', 9900, 0, 9900, 3500, 0, 4000, 1000, true)
ON CONFLICT ("serviceTypeId") DO UPDATE SET
  "baseFeeCents" = EXCLUDED."baseFeeCents",
  "pricePerMileCents" = EXCLUDED."pricePerMileCents",
  "minimumCents" = EXCLUDED."minimumCents",
  "afterHoursCents" = EXCLUDED."afterHoursCents",
  "heavyVehicleCents" = EXCLUDED."heavyVehicleCents",
  "rushCents" = EXCLUDED."rushCents",
  "adminFeeBps" = EXCLUDED."adminFeeBps",
  active = EXCLUDED.active;
