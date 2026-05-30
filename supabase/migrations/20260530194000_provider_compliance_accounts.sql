-- Provider compliance root accounts for RoadAssistNow marketplace onboarding.
-- Extends existing users/drivers/tow_trucks instead of replacing the current schema.

do $$ begin
  create type "ProviderType" as enum ('COMPANY', 'OWNER_OPERATOR');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type "ProviderComplianceStatus" as enum ('DRAFT', 'PENDING_REVIEW', 'NEEDS_INFO', 'APPROVED', 'REJECTED', 'SUSPENDED', 'EXPIRED');
exception
  when duplicate_object then null;
end $$;

create table if not exists "provider_accounts" (
  "id" text primary key,
  "ownerUserId" text not null references "users"("id") on delete cascade,
  "providerType" "ProviderType" not null,
  "legalBusinessName" text not null,
  "displayName" text not null,
  "responsibleManagerName" text not null,
  "businessAddress" text not null,
  "dispatchPhone" text not null,
  "contactEmail" text not null,
  "serviceArea" text not null,
  "complianceStatus" "ProviderComplianceStatus" not null default 'PENDING_REVIEW',
  "guidelinesVersionAccepted" text,
  "guidelinesAcceptedAt" timestamp(3),
  "ratingAverage" decimal(3,2) not null default 5.00,
  "ratingCount" integer not null default 0,
  "stripeConnectAccountId" text unique,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "provider_terms_acceptances" (
  "id" text primary key,
  "providerAccountId" text not null references "provider_accounts"("id") on delete cascade,
  "version" text not null,
  "signerName" text not null,
  "acceptedAt" timestamp(3) not null default current_timestamp
);

alter table "drivers" add column if not exists "providerAccountId" text references "provider_accounts"("id") on delete set null;
alter table "tow_trucks" add column if not exists "providerAccountId" text references "provider_accounts"("id") on delete set null;

create index if not exists "provider_accounts_ownerUserId_idx" on "provider_accounts"("ownerUserId");
create index if not exists "provider_accounts_complianceStatus_idx" on "provider_accounts"("complianceStatus");
create index if not exists "provider_terms_acceptances_providerAccountId_acceptedAt_idx" on "provider_terms_acceptances"("providerAccountId", "acceptedAt");
create index if not exists "drivers_providerAccountId_idx" on "drivers"("providerAccountId");
create index if not exists "tow_trucks_providerAccountId_active_idx" on "tow_trucks"("providerAccountId", "active");

alter table "provider_accounts" enable row level security;
alter table "provider_terms_acceptances" enable row level security;

create policy "providers read own provider account" on "provider_accounts"
  for select using ("ownerUserId" = auth.uid()::text or public.current_user_role() in ('DISPATCHER','ADMIN','SUPER_ADMIN'));

create policy "admins manage provider accounts" on "provider_accounts"
  for all using (public.current_user_role() in ('DISPATCHER','ADMIN','SUPER_ADMIN'));

create policy "providers read own terms acceptances" on "provider_terms_acceptances"
  for select using (
    "providerAccountId" in (select id from "provider_accounts" where "ownerUserId" = auth.uid()::text)
    or public.current_user_role() in ('DISPATCHER','ADMIN','SUPER_ADMIN')
  );

create policy "admins manage provider terms acceptances" on "provider_terms_acceptances"
  for all using (public.current_user_role() in ('DISPATCHER','ADMIN','SUPER_ADMIN'));
