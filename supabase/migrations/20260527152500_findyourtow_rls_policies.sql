-- Supabase RLS policy scaffold for FindYourTow.
-- Apply only when real Supabase Auth is intentionally connected.

alter table users enable row level security;
alter table customers enable row level security;
alter table drivers enable row level security;
alter table tow_requests enable row level security;
alter table tow_status_updates enable row level security;
alter table driver_locations enable row level security;
alter table payments enable row level security;
alter table refunds enable row level security;
alter table audit_logs enable row level security;

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select coalesce((auth.jwt() ->> 'user_role'), 'CUSTOMER')
$$;

create policy "customers read own record" on customers
  for select using (user_id = auth.uid()::text or public.current_user_role() in ('DISPATCHER','ADMIN','SUPER_ADMIN'));

create policy "drivers read own record" on drivers
  for select using (user_id = auth.uid()::text or public.current_user_role() in ('DISPATCHER','ADMIN','SUPER_ADMIN'));

create policy "customers manage own tow requests" on tow_requests
  for all using (
    customer_id in (select id from customers where user_id = auth.uid()::text)
    or public.current_user_role() in ('DISPATCHER','ADMIN','SUPER_ADMIN')
  );

create policy "drivers read assigned tow requests" on tow_requests
  for select using (
    driver_id in (select id from drivers where user_id = auth.uid()::text)
    or public.current_user_role() in ('DISPATCHER','ADMIN','SUPER_ADMIN')
  );

create policy "drivers insert own location" on driver_locations
  for insert with check (driver_id in (select id from drivers where user_id = auth.uid()::text));

create policy "dispatchers read live locations" on driver_locations
  for select using (public.current_user_role() in ('DISPATCHER','ADMIN','SUPER_ADMIN'));

create policy "payment records are protected" on payments
  for select using (
    tow_request_id in (
      select tr.id from tow_requests tr
      join customers c on c.id = tr.customer_id
      where c.user_id = auth.uid()::text
    )
    or public.current_user_role() in ('DISPATCHER','ADMIN','SUPER_ADMIN')
  );

create policy "admin audit read" on audit_logs
  for select using (public.current_user_role() in ('ADMIN','SUPER_ADMIN'));
