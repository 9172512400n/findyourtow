-- Saved customer vehicle profiles and immutable tow request vehicle snapshots.

CREATE TABLE IF NOT EXISTS "vehicles" (
  "id" TEXT NOT NULL,
  "customer_id" TEXT NOT NULL,
  "nickname" TEXT NOT NULL,
  "make" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "year" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "license_plate" TEXT NOT NULL,
  "vin" TEXT,
  "vehicle_type" TEXT NOT NULL,
  "photo_url" TEXT,
  "is_default" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vehicles_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "vehicles_customer_id_idx" ON "vehicles"("customer_id");
CREATE INDEX IF NOT EXISTS "vehicles_customer_id_is_default_idx" ON "vehicles"("customer_id", "is_default");
CREATE UNIQUE INDEX IF NOT EXISTS "vehicles_one_default_per_customer_idx" ON "vehicles"("customer_id") WHERE "is_default" = true;

ALTER TABLE "tow_requests" ADD COLUMN IF NOT EXISTS "vehicle_id" TEXT;
ALTER TABLE "tow_requests" ADD COLUMN IF NOT EXISTS "vehicle_snapshot" JSONB NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tow_requests_vehicle_id_fkey'
  ) THEN
    ALTER TABLE "tow_requests"
      ADD CONSTRAINT "tow_requests_vehicle_id_fkey"
      FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "tow_requests_vehicle_id_idx" ON "tow_requests"("vehicle_id");
