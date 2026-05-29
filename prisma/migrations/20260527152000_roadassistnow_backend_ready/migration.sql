-- RoadAssistNow backend-ready PostgreSQL migration.
-- Generated for future Supabase/Prisma connection. The public prototype remains in demo mode until env keys are added.

create extension if not exists "pgcrypto";

create type user_role as enum ('CUSTOMER','DRIVER','DISPATCHER','ADMIN','SUPER_ADMIN');
create type driver_status as enum ('PENDING_APPROVAL','APPROVED','REJECTED','ONLINE','OFFLINE','BUSY','SUSPENDED');
create type service_type_code as enum ('STANDARD_TOW','FLATBED_TOW','JUMP_START','FLAT_TIRE','LOCKOUT','FUEL_DELIVERY','WINCH_OUT','ACCIDENT_TOW','VEHICLE_TRANSPORT');
create type tow_status as enum ('QUOTE_CREATED','AWAITING_PAYMENT','PAID','SEARCHING_FOR_DRIVER','DRIVER_ASSIGNED','DRIVER_ON_THE_WAY','DRIVER_ARRIVED','VEHICLE_PICKED_UP','IN_TRANSIT','VEHICLE_DELIVERED','COMPLETED','CANCELLED','REFUNDED');
create type payment_status as enum ('REQUIRES_PAYMENT_METHOD','REQUIRES_CONFIRMATION','PROCESSING','SUCCEEDED','FAILED','CANCELLED','REFUNDED');

create table if not exists users (
  id text primary key default gen_random_uuid()::text,
  email text unique not null,
  phone text unique,
  password_hash text,
  role user_role not null default 'CUSTOMER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists customers (
  id text primary key default gen_random_uuid()::text,
  user_id text unique not null references users(id) on delete cascade,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists drivers (
  id text primary key default gen_random_uuid()::text,
  user_id text unique not null references users(id) on delete cascade,
  status driver_status not null default 'PENDING_APPROVAL',
  rating numeric(3,2) not null default 5.00,
  stripe_connect_account_id text unique,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_types (
  id text primary key default gen_random_uuid()::text,
  code service_type_code unique not null,
  name text not null,
  description text not null,
  active boolean not null default true
);

create table if not exists pricing_rules (
  id text primary key default gen_random_uuid()::text,
  service_type_id text unique not null references service_types(id),
  base_fee_cents integer not null,
  price_per_mile_cents integer not null default 500,
  minimum_cents integer,
  after_hours_cents integer not null default 3500,
  heavy_vehicle_cents integer not null default 5000,
  rush_cents integer not null default 4000,
  admin_fee_bps integer not null default 1000,
  active boolean not null default true
);

create table if not exists tow_requests (
  id text primary key default gen_random_uuid()::text,
  customer_id text references customers(id),
  driver_id text references drivers(id),
  service_type_id text not null references service_types(id),
  status tow_status not null default 'QUOTE_CREATED',
  pickup_address text not null,
  pickup_lat numeric(10,7) not null,
  pickup_lng numeric(10,7) not null,
  dropoff_address text,
  dropoff_lat numeric(10,7),
  dropoff_lng numeric(10,7),
  distance_miles numeric(8,2),
  eta_minutes integer,
  vehicle_make text not null,
  vehicle_model text not null,
  vehicle_year text,
  vehicle_color text,
  vehicle_photo_url text,
  notes text,
  quote_cents integer not null,
  total_cents integer not null,
  cancelled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tow_status_updates (
  id text primary key default gen_random_uuid()::text,
  tow_request_id text not null references tow_requests(id) on delete cascade,
  status tow_status not null,
  message text,
  created_by_id text references users(id),
  created_at timestamptz not null default now()
);

create table if not exists driver_locations (
  id text primary key default gen_random_uuid()::text,
  driver_id text not null references drivers(id) on delete cascade,
  lat numeric(10,7) not null,
  lng numeric(10,7) not null,
  heading numeric(6,2),
  speed_mph numeric(6,2),
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id text primary key default gen_random_uuid()::text,
  tow_request_id text unique not null references tow_requests(id) on delete cascade,
  stripe_payment_intent_id text unique not null,
  status payment_status not null,
  amount_cents integer not null,
  currency text not null default 'usd',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists refunds (
  id text primary key default gen_random_uuid()::text,
  payment_id text not null references payments(id) on delete cascade,
  stripe_refund_id text unique,
  amount_cents integer not null,
  reason text,
  created_by_id text references users(id),
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id text primary key default gen_random_uuid()::text,
  actor_id text references users(id),
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists users_role_idx on users(role);
create index if not exists drivers_status_idx on drivers(status);
create index if not exists tow_requests_status_created_idx on tow_requests(status, created_at);
create index if not exists tow_requests_driver_status_idx on tow_requests(driver_id, status);
create index if not exists tow_requests_customer_created_idx on tow_requests(customer_id, created_at);
create index if not exists tow_requests_pickup_location_idx on tow_requests(pickup_lat, pickup_lng);
create index if not exists tow_status_updates_request_created_idx on tow_status_updates(tow_request_id, created_at);
create index if not exists driver_locations_driver_created_idx on driver_locations(driver_id, created_at);
create index if not exists driver_locations_lat_lng_idx on driver_locations(lat, lng);
create index if not exists payments_status_created_idx on payments(status, created_at);
create index if not exists audit_logs_entity_idx on audit_logs(entity, entity_id);
