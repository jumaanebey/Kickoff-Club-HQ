-- Follow-up to 20260907_protect_profile_privileges.sql. The trigger was SECURITY DEFINER, which made
-- current_user = postgres inside it, so the "server only" bypass matched every caller and the guard
-- never fired. Same function body, SECURITY INVOKER. Run in the SQL editor.
create or replace function public.protect_profile_privileges()
returns trigger language plpgsql security invoker set search_path = public as $$
declare
  cols text[] := array['role','subscription_tier','subscription_status','stripe_customer_id','stripe_subscription_id'];
  c text; o jsonb := to_jsonb(OLD); n jsonb := to_jsonb(NEW);
begin
  if current_user in ('postgres','supabase_admin','service_role') or coalesce(auth.role(), '') = 'service_role' then return NEW; end if;
  foreach c in array cols loop
    if (o ? c) and (o->c) is distinct from (n->c) then
      raise exception 'profiles.% can only be changed by the server', c using errcode = '42501';
    end if;
  end loop;
  return NEW;
end; $$;
