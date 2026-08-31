create table if not exists public.marketplace_product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.marketplace_products(id) on delete cascade,
  visitor_key text not null check (char_length(visitor_key) between 8 and 160),
  viewer_id uuid references auth.users(id) on delete set null,
  viewed_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (product_id, visitor_key, viewed_on)
);

create index if not exists marketplace_product_views_product_idx
  on public.marketplace_product_views(product_id, viewed_on desc);

create table if not exists public.marketplace_sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.marketplace_products(id) on delete cascade,
  seller_id uuid not null references public.marketplace_sellers(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 100000),
  amount numeric(12,2) not null default 0 check (amount >= 0),
  status text not null default 'completed' check (status in ('pending','completed','cancelled')),
  note text,
  recorded_by uuid not null default auth.uid() references auth.users(id) on delete set null,
  sold_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists marketplace_sales_seller_idx
  on public.marketplace_sales(seller_id, status, sold_at desc);
create index if not exists marketplace_sales_product_idx
  on public.marketplace_sales(product_id, status, sold_at desc);

alter table public.marketplace_product_views enable row level security;
alter table public.marketplace_sales enable row level security;

create policy "Sellers can view their product analytics"
  on public.marketplace_product_views for select
  using (exists (
    select 1 from public.marketplace_products p
    join public.marketplace_sellers s on s.id = p.seller_id
    where p.id = marketplace_product_views.product_id
      and s.user_id = auth.uid()
  ) or public.is_admin());

create policy "Sellers can view their sales"
  on public.marketplace_sales for select
  using (seller_id in (
    select s.id from public.marketplace_sellers s where s.user_id = auth.uid()
  ) or public.is_admin());

create policy "Sellers can update their sales"
  on public.marketplace_sales for update
  using (seller_id in (
    select s.id from public.marketplace_sellers s where s.user_id = auth.uid()
  ) or public.is_admin())
  with check (seller_id in (
    select s.id from public.marketplace_sellers s where s.user_id = auth.uid()
  ) or public.is_admin());

create policy "Admins can manage marketplace analytics"
  on public.marketplace_product_views for all
  using (public.is_admin()) with check (public.is_admin());

create policy "Admins can manage marketplace sales"
  on public.marketplace_sales for all
  using (public.is_admin()) with check (public.is_admin());

create or replace function public.record_marketplace_product_view(
  p_product_id uuid,
  p_visitor_key text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_product_id is null or p_visitor_key is null or char_length(trim(p_visitor_key)) < 8 then
    return;
  end if;

  if not exists (
    select 1
    from public.marketplace_products p
    join public.marketplace_sellers s on s.id = p.seller_id
    where p.id = p_product_id
      and p.status = 'approved'
      and s.is_approved = true
      and s.is_active = true
  ) then
    return;
  end if;

  insert into public.marketplace_product_views (product_id, visitor_key, viewer_id)
  values (p_product_id, left(trim(p_visitor_key), 160), auth.uid())
  on conflict (product_id, visitor_key, viewed_on) do nothing;
end;
$$;

grant execute on function public.record_marketplace_product_view(uuid, text) to anon, authenticated;

create or replace function public.record_marketplace_sale(
  p_product_id uuid,
  p_quantity integer,
  p_amount numeric,
  p_note text default null,
  p_sold_at timestamptz default now()
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_seller_id uuid;
  v_sale_id uuid;
begin
  select p.seller_id into v_seller_id
  from public.marketplace_products p
  join public.marketplace_sellers s on s.id = p.seller_id
  where p.id = p_product_id
    and s.user_id = auth.uid()
    and s.is_approved = true
    and s.is_active = true;

  if v_seller_id is null then
    raise exception 'Seller is not allowed to record this product sale';
  end if;
  if p_quantity is null or p_quantity < 1 or p_quantity > 100000 then
    raise exception 'Invalid quantity';
  end if;
  if p_amount is null or p_amount < 0 then
    raise exception 'Invalid amount';
  end if;

  insert into public.marketplace_sales (product_id, seller_id, quantity, amount, note, recorded_by, sold_at)
  values (p_product_id, v_seller_id, p_quantity, round(p_amount, 2), nullif(trim(p_note), ''), auth.uid(), coalesce(p_sold_at, now()))
  returning id into v_sale_id;
  return v_sale_id;
end;
$$;

grant execute on function public.record_marketplace_sale(uuid, integer, numeric, text, timestamptz) to authenticated;

create or replace function public.get_marketplace_seller_stats(p_seller_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stats jsonb;
begin
  if not exists (
    select 1 from public.marketplace_sellers s
    where s.id = p_seller_id and (s.user_id = auth.uid() or public.is_admin())
  ) then
    raise exception 'Not allowed to view seller analytics';
  end if;

  select jsonb_build_object(
    'total_views', coalesce((select count(*) from public.marketplace_product_views v join public.marketplace_products p on p.id = v.product_id where p.seller_id = p_seller_id), 0),
    'total_sales', coalesce((select sum(quantity) from public.marketplace_sales s where s.seller_id = p_seller_id and s.status = 'completed'), 0),
    'total_revenue', coalesce((select sum(amount) from public.marketplace_sales s where s.seller_id = p_seller_id and s.status = 'completed'), 0),
    'products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'product_id', p.id,
        'title_ar', p.title_ar,
        'views', (select count(*) from public.marketplace_product_views v where v.product_id = p.id),
        'sales', coalesce((select sum(s.quantity) from public.marketplace_sales s where s.product_id = p.id and s.status = 'completed'), 0),
        'revenue', coalesce((select sum(s.amount) from public.marketplace_sales s where s.product_id = p.id and s.status = 'completed'), 0)
      ) order by p.created_at desc)
      from public.marketplace_products p
      where p.seller_id = p_seller_id
    ), '[]'::jsonb)
  ) into v_stats;

  return v_stats;
end;
$$;

grant execute on function public.get_marketplace_seller_stats(uuid) to authenticated;
