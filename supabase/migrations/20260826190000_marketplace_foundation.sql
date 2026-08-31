-- Murshid Marketplace foundation
-- Seller access is granted by an administrator through marketplace_sellers.

create extension if not exists pgcrypto;

create table if not exists public.marketplace_settings (
  id text primary key default 'global',
  is_enabled boolean not null default false,
  message_ar text not null default 'السوق مغلق مؤقتاً. سنعود قريباً.',
  message_en text not null default 'The marketplace is temporarily closed. We will be back soon.',
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id),
  constraint marketplace_settings_singleton check (id = 'global')
);

create table if not exists public.marketplace_sellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  store_name_ar text not null,
  store_name_en text,
  description_ar text,
  description_en text,
  phone text,
  whatsapp_url text,
  logo_url text,
  is_approved boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.marketplace_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.marketplace_products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.marketplace_sellers(id) on delete cascade,
  category_id uuid references public.marketplace_categories(id) on delete set null,
  title_ar text not null,
  title_en text,
  description_ar text,
  description_en text,
  price numeric(10,2),
  currency text not null default 'JOD',
  image_url text,
  contact_url text,
  status text not null default 'pending',
  is_featured boolean not null default false,
  stock_label_ar text not null default 'متوفر',
  stock_label_en text not null default 'Available',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint marketplace_products_status_check check (status in ('pending','approved','rejected','archived')),
  constraint marketplace_products_currency_check check (currency in ('JOD','USD'))
);

create index if not exists marketplace_products_seller_idx on public.marketplace_products(seller_id);
create index if not exists marketplace_products_category_idx on public.marketplace_products(category_id);
create index if not exists marketplace_products_status_idx on public.marketplace_products(status);
create index if not exists marketplace_sellers_user_idx on public.marketplace_sellers(user_id);

create or replace function public.set_marketplace_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists marketplace_settings_updated_at on public.marketplace_settings;
create trigger marketplace_settings_updated_at
before update on public.marketplace_settings
for each row execute function public.set_marketplace_updated_at();

drop trigger if exists marketplace_sellers_updated_at on public.marketplace_sellers;
create trigger marketplace_sellers_updated_at
before update on public.marketplace_sellers
for each row execute function public.set_marketplace_updated_at();

drop trigger if exists marketplace_products_updated_at on public.marketplace_products;
create trigger marketplace_products_updated_at
before update on public.marketplace_products
for each row execute function public.set_marketplace_updated_at();

insert into public.marketplace_settings (id)
values ('global')
on conflict (id) do nothing;

insert into public.marketplace_categories (slug, name_ar, name_en, icon, sort_order)
values
  ('books', 'كتب وملخصات', 'Books & Notes', 'BookOpen', 1),
  ('tools', 'معدات وأدوات', 'Tools & Equipment', 'Wrench', 2),
  ('services', 'خدمات طلابية', 'Student Services', 'BriefcaseBusiness', 3),
  ('electronics', 'إلكترونيات', 'Electronics', 'Cpu', 4),
  ('other', 'متنوع', 'Other', 'Package', 5)
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  icon = excluded.icon,
  sort_order = excluded.sort_order;

alter table public.marketplace_settings enable row level security;
alter table public.marketplace_sellers enable row level security;
alter table public.marketplace_categories enable row level security;
alter table public.marketplace_products enable row level security;

drop policy if exists marketplace_settings_public_read on public.marketplace_settings;
drop policy if exists marketplace_settings_admin_all on public.marketplace_settings;
create policy marketplace_settings_public_read
on public.marketplace_settings for select to public using (true);
create policy marketplace_settings_admin_all
on public.marketplace_settings for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists marketplace_sellers_public_read on public.marketplace_sellers;
drop policy if exists marketplace_sellers_owner_read on public.marketplace_sellers;
drop policy if exists marketplace_sellers_owner_update on public.marketplace_sellers;
drop policy if exists marketplace_sellers_admin_all on public.marketplace_sellers;
create policy marketplace_sellers_public_read
on public.marketplace_sellers for select to public
using (is_approved = true and is_active = true);
create policy marketplace_sellers_owner_read
on public.marketplace_sellers for select to authenticated
using (auth.uid() = user_id);
create policy marketplace_sellers_owner_update
on public.marketplace_sellers for update to authenticated
using (auth.uid() = user_id and is_approved = true)
with check (auth.uid() = user_id and is_approved = true);
create policy marketplace_sellers_admin_all
on public.marketplace_sellers for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists marketplace_categories_public_read on public.marketplace_categories;
drop policy if exists marketplace_categories_admin_all on public.marketplace_categories;
create policy marketplace_categories_public_read
on public.marketplace_categories for select to public
using (is_active = true);
create policy marketplace_categories_admin_all
on public.marketplace_categories for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists marketplace_products_public_read on public.marketplace_products;
drop policy if exists marketplace_products_owner_read on public.marketplace_products;
drop policy if exists marketplace_products_owner_insert on public.marketplace_products;
drop policy if exists marketplace_products_owner_update on public.marketplace_products;
drop policy if exists marketplace_products_owner_delete on public.marketplace_products;
drop policy if exists marketplace_products_admin_all on public.marketplace_products;
create policy marketplace_products_public_read
on public.marketplace_products for select to public
using (
  status = 'approved'
  and exists (
    select 1 from public.marketplace_sellers s
    where s.id = seller_id and s.is_approved = true and s.is_active = true
  )
);
create policy marketplace_products_owner_read
on public.marketplace_products for select to authenticated
using (
  exists (
    select 1 from public.marketplace_sellers s
    where s.id = seller_id and s.user_id = auth.uid()
  )
);
create policy marketplace_products_owner_insert
on public.marketplace_products for insert to authenticated
with check (
  status = 'pending'
  and exists (
    select 1 from public.marketplace_sellers s
    where s.id = seller_id and s.user_id = auth.uid() and s.is_approved = true and s.is_active = true
  )
);
create policy marketplace_products_owner_update
on public.marketplace_products for update to authenticated
using (
  exists (
    select 1 from public.marketplace_sellers s
    where s.id = seller_id and s.user_id = auth.uid() and s.is_approved = true and s.is_active = true
  )
)
with check (
  status in ('pending','archived')
  and exists (
    select 1 from public.marketplace_sellers s
    where s.id = seller_id and s.user_id = auth.uid() and s.is_approved = true and s.is_active = true
  )
);
create policy marketplace_products_owner_delete
on public.marketplace_products for delete to authenticated
using (
  exists (
    select 1 from public.marketplace_sellers s
    where s.id = seller_id and s.user_id = auth.uid()
  )
);
create policy marketplace_products_admin_all
on public.marketplace_products for all to authenticated
using (public.is_admin()) with check (public.is_admin());

comment on table public.marketplace_sellers is 'Approved Murshid marketplace sellers; rows are provisioned by admins.';
comment on table public.marketplace_products is 'Marketplace listings submitted by approved sellers and moderated by admins.';
comment on table public.marketplace_settings is 'Global marketplace availability and closed-message settings.';
