create or replace function public.marketplace_find_users_by_email(search_email text)
returns table (user_id uuid, email text, is_seller boolean)
language sql
security definer
set search_path = public, auth, pg_temp
as $$
  select
    u.id as user_id,
    u.email,
    exists (
      select 1
      from public.marketplace_sellers s
      where s.user_id = u.id
    ) as is_seller
  from auth.users u
  where public.is_admin()
    and lower(coalesce(u.email, '')) like '%@gmail.com'
    and lower(coalesce(u.email, '')) like '%' || lower(trim(search_email)) || '%'
  order by u.created_at desc
  limit 20;
$$;

revoke all on function public.marketplace_find_users_by_email(text) from public;
grant execute on function public.marketplace_find_users_by_email(text) to authenticated;
