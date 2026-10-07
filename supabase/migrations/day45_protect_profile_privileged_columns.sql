-- Day 45: Protect privileged columns on public.profiles
--
-- Problem: "Users can update own profile" has WITH CHECK = null, so it only
-- verifies row ownership. A logged-in user could self-set role,
-- is_verified_owner, is_verified_agent or agent_status.
--
-- Fix: BEFORE UPDATE trigger. Non-admins cannot change those columns,
-- except agent_status none/rejected -> pending (the BecomeAgent.jsx apply flow).
-- Admins (is_admin()) and the SQL Editor / service role (auth.uid() is null)
-- pass through untouched.

create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- SQL Editor / service role / admins: no restrictions
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if new.role is distinct from old.role then
    raise exception 'Not allowed to change role';
  end if;

  if new.is_verified_owner is distinct from old.is_verified_owner then
    raise exception 'Not allowed to change is_verified_owner';
  end if;

  if new.is_verified_agent is distinct from old.is_verified_agent then
    raise exception 'Not allowed to change is_verified_agent';
  end if;

  if new.agent_status is distinct from old.agent_status then
    if not (new.agent_status = 'pending' and old.agent_status in ('none', 'rejected')) then
      raise exception 'Invalid agent_status change';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_privileged_columns on public.profiles;

create trigger protect_profile_privileged_columns
before update on public.profiles
for each row
execute function public.protect_profile_privileged_columns();

-- ---------------------------------------------------------------
-- TEST (run separately, replace the UUID with a NON-admin test owner's id).
-- Expected: ERROR "Not allowed to change is_verified_agent".
--
-- begin;
-- set local role authenticated;
-- select set_config('request.jwt.claims',
--   '{"sub":"<test-owner-uuid>","role":"authenticated"}', true);
-- update public.profiles set is_verified_agent = true
--   where id = '<test-owner-uuid>';
-- rollback;
-- ---------------------------------------------------------------
