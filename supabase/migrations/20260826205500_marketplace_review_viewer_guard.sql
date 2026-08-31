create or replace function public.get_marketplace_product_review_summary(p_product_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'average_rating', coalesce(round(avg(r.rating)::numeric, 2), 0),
    'review_count', count(r.id)::integer,
    'can_review', (
      auth.uid() is not null
      and not exists (
        select 1
        from public.marketplace_sellers viewer_seller
        where viewer_seller.id = p.seller_id
          and viewer_seller.user_id = auth.uid()
      )
    ),
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
  from public.marketplace_products p
  join public.marketplace_sellers s on s.id = p.seller_id
  left join public.marketplace_reviews r
    on r.product_id = p.id and r.status = 'approved'
  where p.id = p_product_id
    and p.status = 'approved'
    and s.is_approved = true
    and s.is_active = true
  group by p.id, p.seller_id;
$$;

grant execute on function public.get_marketplace_product_review_summary(uuid) to anon, authenticated;
