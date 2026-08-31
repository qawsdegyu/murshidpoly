create table if not exists public.marketplace_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.marketplace_products(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  review_text text not null default '' check (char_length(review_text) <= 1200),
  status text not null default 'approved' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, reviewer_id)
);

create index if not exists marketplace_reviews_product_idx
  on public.marketplace_reviews(product_id, status, created_at desc);

alter table public.marketplace_reviews enable row level security;

create policy "Anyone can read approved marketplace reviews"
  on public.marketplace_reviews for select to public
  using (status = 'approved');

create policy "Users can manage their own marketplace review"
  on public.marketplace_reviews for all to authenticated
  using (reviewer_id = auth.uid())
  with check (reviewer_id = auth.uid() and status = 'approved');

create policy "Admins can manage marketplace reviews"
  on public.marketplace_reviews for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create or replace function public.set_marketplace_review_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists marketplace_reviews_updated_at on public.marketplace_reviews;
create trigger marketplace_reviews_updated_at
before update on public.marketplace_reviews
for each row execute function public.set_marketplace_review_updated_at();

create or replace function public.submit_marketplace_review(
  p_product_id uuid,
  p_rating integer,
  p_review_text text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_review_id uuid;
  v_seller_id uuid;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to review a product';
  end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'Rating must be between 1 and 5';
  end if;
  if char_length(coalesce(p_review_text, '')) > 1200 then
    raise exception 'Review is too long';
  end if;

  select p.seller_id into v_seller_id
  from public.marketplace_products p
  join public.marketplace_sellers s on s.id = p.seller_id
  where p.id = p_product_id
    and p.status = 'approved'
    and s.is_approved = true
    and s.is_active = true;

  if v_seller_id is null then
    raise exception 'Product is not available for review';
  end if;
  if exists (
    select 1 from public.marketplace_sellers s
    where s.id = v_seller_id and s.user_id = auth.uid()
  ) then
    raise exception 'Sellers cannot review their own products';
  end if;

  insert into public.marketplace_reviews (product_id, reviewer_id, rating, review_text, status)
  values (p_product_id, auth.uid(), p_rating, trim(coalesce(p_review_text, '')), 'approved')
  on conflict (product_id, reviewer_id) do update
    set rating = excluded.rating,
        review_text = excluded.review_text,
        status = 'approved',
        updated_at = now()
  returning id into v_review_id;

  return v_review_id;
end;
$$;

grant execute on function public.submit_marketplace_review(uuid, integer, text) to authenticated;

create or replace function public.get_marketplace_product_review_summary(p_product_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'average_rating', coalesce(round(avg(r.rating)::numeric, 2), 0),
    'review_count', count(*)::integer,
    'reviews', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'rating', r.rating,
          'review_text', r.review_text,
          'created_at', r.created_at,
          'reviewer_label', 'طالب مرشد'
        ) order by r.created_at desc
      ) filter (where r.id is not null),
      '[]'::jsonb
    )
  )
  from public.marketplace_reviews r
  join public.marketplace_products p on p.id = r.product_id
  join public.marketplace_sellers s on s.id = p.seller_id
  where r.product_id = p_product_id
    and r.status = 'approved'
    and p.status = 'approved'
    and s.is_approved = true
    and s.is_active = true;
$$;

grant execute on function public.get_marketplace_product_review_summary(uuid) to anon, authenticated;
