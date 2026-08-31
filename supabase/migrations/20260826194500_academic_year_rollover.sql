create table if not exists public.academic_year_rollovers (
  cycle_key text primary key,
  changed_at timestamptz not null default timezone('utc'::text, now()),
  rolled_by uuid references auth.users(id),
  updated_rows integer not null default 0,
  capped_rows integer not null default 0,
  skipped_rows integer not null default 0,
  constraint academic_year_rollovers_cycle_key_check check (cycle_key ~ '^[0-9]{4}-[0-9]{4}$')
);

alter table public.academic_year_rollovers enable row level security;

drop policy if exists academic_year_rollovers_admin_read on public.academic_year_rollovers;
drop policy if exists academic_year_rollovers_admin_all on public.academic_year_rollovers;
create policy academic_year_rollovers_admin_all
on public.academic_year_rollovers for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create or replace function public.rollover_academic_year(p_cycle_key text)
returns table (cycle_key text, updated_rows integer, capped_rows integer, skipped_rows integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  existing_rollover public.academic_year_rollovers%rowtype;
  changed_count integer := 0;
  capped_count integer := 0;
  skipped_count integer := 0;
begin
  if not public.is_admin() then
    raise exception 'Only administrators can roll over academic years';
  end if;

  if trim(coalesce(p_cycle_key, '')) !~ '^[0-9]{4}-[0-9]{4}$' then
    raise exception 'Cycle key must use the format YYYY-YYYY';
  end if;

  select * into existing_rollover
  from public.academic_year_rollovers
  where academic_year_rollovers.cycle_key = trim(p_cycle_key);

  if found then
    return query select existing_rollover.cycle_key, existing_rollover.updated_rows, existing_rollover.capped_rows, existing_rollover.skipped_rows;
    return;
  end if;

  insert into public.academic_year_rollovers (cycle_key, rolled_by)
  values (trim(p_cycle_key), auth.uid());

  update public.profiles
  set academic_year = case
    when academic_year in ('1', '2', '3') then (academic_year::integer + 1)::text
    else academic_year
  end,
  updated_at = timezone('utc'::text, now())
  where academic_year in ('1', '2', '3');
  get diagnostics changed_count = row_count;

  select count(*)::integer into capped_count
  from public.profiles
  where academic_year = '4';

  select count(*)::integer into skipped_count
  from public.profiles
  where academic_year is null or trim(academic_year) = '' or academic_year not in ('1', '2', '3', '4');

  update public.academic_year_rollovers
  set updated_rows = changed_count,
      capped_rows = capped_count,
      skipped_rows = skipped_count
  where academic_year_rollovers.cycle_key = trim(p_cycle_key);

  return query select trim(p_cycle_key), changed_count, capped_count, skipped_count;
end;
$$;

revoke all on function public.rollover_academic_year(text) from public;
grant execute on function public.rollover_academic_year(text) to authenticated;
