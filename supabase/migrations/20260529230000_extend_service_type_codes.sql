-- Extend RoadAssistNow service enum so every app service can persist to Supabase.
-- Seed rows live in the next migration because Postgres cannot safely use a newly
-- added enum value in the same migration transaction.
ALTER TYPE "ServiceTypeCode" ADD VALUE IF NOT EXISTS 'MOTORCYCLE_TOW';
ALTER TYPE "ServiceTypeCode" ADD VALUE IF NOT EXISTS 'BATTERY_HELP';
ALTER TYPE "ServiceTypeCode" ADD VALUE IF NOT EXISTS 'HEAVY_DUTY_TOW';
ALTER TYPE "ServiceTypeCode" ADD VALUE IF NOT EXISTS 'BOX_TRUCK_TOW';
ALTER TYPE "ServiceTypeCode" ADD VALUE IF NOT EXISTS 'PRIVATE_PROPERTY_TOW';
ALTER TYPE "ServiceTypeCode" ADD VALUE IF NOT EXISTS 'EMERGENCY_ROADSIDE';
