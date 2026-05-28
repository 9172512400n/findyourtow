-- RLS policies for customer vehicle profiles.
ALTER TABLE IF EXISTS public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_read_own_vehicles" ON public.vehicles;
CREATE POLICY "customers_read_own_vehicles" ON public.vehicles
  FOR SELECT
  USING (
    customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS "customers_insert_own_vehicles" ON public.vehicles;
CREATE POLICY "customers_insert_own_vehicles" ON public.vehicles
  FOR INSERT
  WITH CHECK (
    customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS "customers_update_own_vehicles" ON public.vehicles;
CREATE POLICY "customers_update_own_vehicles" ON public.vehicles
  FOR UPDATE
  USING (
    customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()::text)
  )
  WITH CHECK (
    customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS "customers_delete_own_vehicles" ON public.vehicles;
CREATE POLICY "customers_delete_own_vehicles" ON public.vehicles
  FOR DELETE
  USING (
    customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()::text)
  );
