-- Users could UPDATE their own profiles row with no column restriction, so any signed-in
-- user could set role='admin' or subscription_tier='premium' from the browser.
-- Privileged columns may now change only via the service role (webhooks) or the dashboard.

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cols text[] := array['role','subscription_tier','subscription_status','stripe_customer_id','stripe_subscription_id'];
  c text;
  o jsonb := to_jsonb(OLD);
  n jsonb := to_jsonb(NEW);
begin
  if coalesce(auth.role(), '') = 'service_role' or current_user in ('postgres','supabase_admin') then
    return NEW;
  end if;
  foreach c in array cols loop
    if (o ? c) and (o->c) is distinct from (n->c) then
      raise exception 'profiles.% can only be changed by the server', c using errcode = '42501';
    end if;
  end loop;
  return NEW;
end;
$$;

drop trigger if exists protect_profile_privileges on public.profiles;
create trigger protect_profile_privileges
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- Also stop a user from re-pointing their row at another id.
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- The Stripe webhook writes these; they were never added to the live table.
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists stripe_subscription_id text;
create index if not exists idx_profiles_stripe_customer on public.profiles(stripe_customer_id);

-- public.exec(query text) was SECURITY DEFINER, owned by postgres, and executable by anon:
-- arbitrary SQL for anyone holding the publishable key. Only a one-off script ever used it.
drop function if exists public.exec(text);
