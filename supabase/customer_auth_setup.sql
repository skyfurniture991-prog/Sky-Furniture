-- =====================================================================
-- SKY FURNITURE: SETUP LOGIN GOOGLE & PRIVASI PESANAN PELANGGAN
--
-- Jalankan skrip ini di:
-- Supabase Dashboard > SQL Editor > New query > Run
-- =====================================================================

-- 1. Tambahkan kolom user_id pada tabel orders (jika belum ada)
alter table public.orders 
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists orders_user_id_idx on public.orders (user_id);

-- Pastikan metode pembayaran lengkap di Supabase
insert into public.payment_methods (id, group_key, name, code, description, sort_order)
values 
  ('bri', 'transfer', 'BRI Virtual Account', 'BRI', 'Pembayaran otomatis via BRIMO / ATM BRI', 3),
  ('bca', 'transfer', 'BCA Virtual Account', 'BCA', 'Pembayaran otomatis via BCA', 0),
  ('mandiri', 'transfer', 'Mandiri Virtual Account', 'Mandiri', 'Pembayaran via Livin Mandiri', 1),
  ('bni', 'transfer', 'BNI Virtual Account', 'BNI', 'Pembayaran via BNI Mobile', 2)
on conflict (id) do update set is_active = true;

-- 2. Kebijakan Row Level Security (RLS) agar pembeli hanya bisa melihat pesanannya sendiri
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;

-- Policy: Pelanggan membaca pesanan miliknya sendiri (atau admin membaca semua)
drop policy if exists "users read own orders" on public.orders;
create policy "users read own orders" on public.orders
  for select to authenticated
  using (
    user_id = auth.uid() 
    or customer_email = (auth.jwt() ->> 'email') 
    or public.is_admin()
  );

-- Policy: Pelanggan membaca item pesanan miliknya sendiri
drop policy if exists "users read own order items" on public.order_items;
create policy "users read own order items" on public.order_items
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or o.customer_email = (auth.jwt() ->> 'email') or public.is_admin())
    )
  );

-- Policy: Pelanggan membaca riwayat status pesanan miliknya sendiri
drop policy if exists "users read own order history" on public.order_status_history;
create policy "users read own order history" on public.order_status_history
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_status_history.order_id
        and (o.user_id = auth.uid() or o.customer_email = (auth.jwt() ->> 'email') or public.is_admin())
    )
  );

-- 3. Perbarui fungsi place_order agar otomatis merekam user_id dari auth.uid()
create or replace function public.place_order(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_items     jsonb := coalesce(p_payload -> 'items', '[]'::jsonb);
  v_cust      jsonb := coalesce(p_payload -> 'customer', '{}'::jsonb);
  v_item      jsonb;
  v_prod      public.products%rowtype;
  v_bonus     public.products%rowtype;
  v_ship      public.shipping_methods%rowtype;
  v_pay       public.payment_methods%rowtype;
  v_promo     public.promo_codes%rowtype;
  v_promo_in  text := upper(trim(coalesce(p_payload ->> 'promoCode', '')));
  v_max_qty   int  := setting_num('max_qty', 10)::int;
  v_tax_rate  numeric := setting_num('tax_rate', 0.11);
  v_qty       int;
  v_material  text;
  v_delta     int;
  v_unit      int;
  v_subtotal  int := 0;
  v_discount  int := 0;
  v_shipping  int := 0;
  v_total     int;
  v_tax       int;
  v_order_id  uuid;
  v_label     text;
begin
  if jsonb_typeof(v_items) <> 'array' or jsonb_array_length(v_items) = 0 or jsonb_array_length(v_items) > 50 then
    raise exception 'Keranjang kosong atau tidak valid.';
  end if;

  if length(trim(coalesce(v_cust ->> 'name', ''))) < 2
     or length(trim(coalesce(v_cust ->> 'phone', ''))) < 8
     or length(trim(coalesce(v_cust ->> 'address', ''))) < 5 then
    raise exception 'Data pelanggan belum lengkap.';
  end if;

  select * into v_ship from public.shipping_methods
   where id = p_payload ->> 'shippingId' and is_active;
  if not found then
    raise exception 'Metode pengiriman tidak tersedia.';
  end if;

  select * into v_pay from public.payment_methods
   where id = p_payload ->> 'paymentId' and is_active;
  if not found then
    select * into v_pay from public.payment_methods where id = 'bca' and is_active limit 1;
  end if;

  v_label := coalesce(nullif(trim(p_payload ->> 'paymentLabel'), ''), v_pay.name, 'Pembayaran Midtrans');

  -- Simpan pesanan dengan user_id auth.uid() jika user sedang login
  insert into public.orders (
    user_id, code, customer_name, customer_phone, customer_email, address, province, city, district,
    postal_code, customer_notes, workshop_notes,
    shipping_id, shipping_name, payment_id, payment_name, promo_code
  ) values (
    auth.uid(),
    coalesce(nullif(trim(p_payload ->> 'code'), ''), public.generate_order_code()),
    left(trim(v_cust ->> 'name'), 120),
    left(trim(v_cust ->> 'phone'), 30),
    left(nullif(trim(coalesce(v_cust ->> 'email', '')), ''), 160),
    left(trim(v_cust ->> 'address'), 500),
    left(nullif(trim(coalesce(v_cust ->> 'province', '')), ''), 60),
    left(nullif(trim(coalesce(v_cust ->> 'city', '')), ''), 80),
    left(nullif(trim(coalesce(v_cust ->> 'district', '')), ''), 80),
    left(nullif(trim(coalesce(v_cust ->> 'postalCode', '')), ''), 12),
    left(nullif(trim(coalesce(v_cust ->> 'notes', '')), ''), 1000),
    left(nullif(trim(coalesce(v_cust ->> 'workshopNotes', '')), ''), 1000),
    v_ship.id, v_ship.name, v_pay.id, left(v_label, 120), nullif(v_promo_in, '')
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(v_items) loop
    select * into v_prod from public.products
     where id = (v_item ->> 'productId')::bigint and is_active;
    if not found then
      raise exception 'Produk #% tidak tersedia.', (v_item ->> 'productId');
    end if;

    v_qty := greatest(1, least(v_max_qty, coalesce((v_item ->> 'qty')::int, 1)));
    v_material := nullif(trim(coalesce(v_item ->> 'material', '')), '');
    v_delta := 0;

    if v_material is not null and v_material <> coalesce(v_prod.material, '') then
      select price into v_delta from public.materials where name = v_material;
      v_delta := coalesce(v_delta, 0);
    end if;

    v_unit := v_prod.price + v_delta;
    v_subtotal := v_subtotal + (v_unit * v_qty);

    insert into public.order_items (
      order_id, product_id, slug, name, image, options, material, qty, unit, total
    ) values (
      v_order_id, v_prod.id, v_prod.slug, v_prod.name, v_prod.image,
      case
        when jsonb_typeof(v_item -> 'options') = 'array' then
          array(select jsonb_array_elements_text(v_item -> 'options'))
        else '{}'::text[]
      end,
      v_material, v_qty, v_unit, v_unit * v_qty
    );
  end loop;

  if v_promo_in <> '' then
    select * into v_promo from public.promo_codes
     where code = v_promo_in and is_active
       and (starts_at is null or starts_at <= now())
       and (ends_at is null or ends_at >= now());

    if found and (v_promo.usage_limit is null or v_promo.used_count < v_promo.usage_limit)
       and v_subtotal >= v_promo.min_subtotal then

      if v_promo.type = 'percent' then
        v_discount := round(v_subtotal * (v_promo.value::numeric / 100))::int;
        if v_promo.max_discount is not null then
          v_discount := least(v_discount, v_promo.max_discount);
        end if;
      elsif v_promo.type = 'flat' then
        v_discount := least(v_promo.value, v_subtotal);
      elsif v_promo.type = 'shipping' then
        v_discount := least(v_promo.value, v_ship.price);
      end if;

      update public.promo_codes
         set used_count = used_count + 1
       where code = v_promo.code;
    end if;
  end if;

  if v_ship.free_above is not null and v_subtotal >= v_ship.free_above then
    v_shipping := 0;
  else
    v_shipping := greatest(0, v_ship.price - case when v_promo.type = 'shipping' then v_discount else 0 end);
  end if;

  v_total := greatest(0, v_subtotal - (case when v_promo.type <> 'shipping' then v_discount else 0 end) + v_shipping);
  v_tax   := round(v_total * v_tax_rate / (1 + v_tax_rate))::int;

  update public.orders
     set subtotal     = v_subtotal,
         discount     = v_discount,
         shipping_fee = v_shipping,
         tax          = v_tax,
         total        = v_total,
         shipping_eta = now() + make_interval(days => v_ship.days_max + 3)
   where id = v_order_id;

  return public.order_to_json(v_order_id);
end;
$$;

