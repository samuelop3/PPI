-- Esquema inicial para una instalación nueva de PPI en Supabase.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default '',
  bio text not null default '',
  phone text not null default '',
  location text not null default '',
  favorites text not null default '',
  interests text not null default '',
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 500),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.pomodoro_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  work_minutes integer not null default 25 check (work_minutes between 1 and 480),
  break_minutes integer not null default 5 check (break_minutes between 1 and 480),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Recordatorio',
  message text not null check (char_length(trim(message)) between 1 and 500),
  scheduled_at timestamptz not null,
  email_address text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'delivered', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  locked_at timestamptz,
  delivered_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

insert into public.profiles (id, email, name)
select
  id,
  email,
  coalesce(raw_user_meta_data ->> 'name', '')
from auth.users
where email is not null
on conflict (id) do nothing;

create index if not exists tasks_user_created_idx on public.tasks (user_id, created_at desc);
create index if not exists notifications_due_idx on public.notifications (scheduled_at) where status in ('pending', 'processing');
create index if not exists notifications_user_scheduled_idx on public.notifications (user_id, scheduled_at desc);
create index if not exists notifications_user_created_idx on public.notifications (user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', '')
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('admin', 'moderator')
  );
$$;

create or replace function public.enforce_notification_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    select count(*)
    from public.notifications n
    where n.user_id = new.user_id
      and n.created_at >= now() - interval '24 hours'
  ) >= 100 then
    raise exception 'Alcanzaste el límite diario de 100 recordatorios.';
  end if;
  return new;
end;
$$;

drop trigger if exists notifications_daily_limit on public.notifications;
create trigger notifications_daily_limit
before insert on public.notifications
for each row execute procedure public.enforce_notification_limit();

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.pomodoro_settings enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin" on public.profiles
for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (name, bio, phone, location, favorites, interests, updated_at) on public.profiles to authenticated;

drop policy if exists "tasks_manage_self" on public.tasks;
create policy "tasks_manage_self" on public.tasks
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
grant select, insert, update, delete on public.tasks to authenticated;

drop policy if exists "pomodoro_settings_manage_self" on public.pomodoro_settings;
create policy "pomodoro_settings_manage_self" on public.pomodoro_settings
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
grant select, insert, update, delete on public.pomodoro_settings to authenticated;

drop policy if exists "notifications_select_self" on public.notifications;
create policy "notifications_select_self" on public.notifications
for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "notifications_insert_self" on public.notifications;
create policy "notifications_insert_self" on public.notifications
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and status = 'pending'
  and attempts = 0
  and scheduled_at > now()
  and (
    email_address is null
    or lower(email_address) = lower((select auth.jwt() ->> 'email'))
  )
);

drop policy if exists "notifications_delete_self" on public.notifications;
create policy "notifications_delete_self" on public.notifications
for delete to authenticated
using (user_id = (select auth.uid()) and status <> 'processing');
grant select, insert, delete on public.notifications to authenticated;

create or replace function public.admin_list_users()
returns table (email text, name text, role text)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'Solo un administrador puede consultar los usuarios.';
  end if;
  return query select p.email, p.name, p.role from public.profiles p order by p.email;
end;
$$;

create or replace function public.admin_change_user_role(target_email text, new_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_id uuid;
  admin_count integer;
begin
  if not (select public.is_admin()) then
    raise exception 'Solo un administrador puede cambiar roles.';
  end if;
  if new_role not in ('user', 'moderator', 'admin') then
    raise exception 'El rol solicitado no es válido.';
  end if;
  select id into target_id from public.profiles where profiles.email = target_email;
  if target_id is null then
    raise exception 'No se encontró el usuario indicado.';
  end if;
  if target_id = (select auth.uid()) and new_role <> 'admin' then
    select count(*) into admin_count from public.profiles where role = 'admin';
    if admin_count <= 1 then
      raise exception 'No se puede retirar el rol del último administrador.';
    end if;
  end if;
  update public.profiles set role = new_role, updated_at = now() where id = target_id;
end;
$$;

create or replace function public.staff_report_summary()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  summary jsonb;
begin
  if not (select public.is_staff()) then
    raise exception 'No tienes permiso para consultar los reportes.';
  end if;
  select jsonb_build_object(
    'users', (select count(*) from public.profiles),
    'tasks', (select count(*) from public.tasks),
    'completed_tasks', (select count(*) from public.tasks where completed)
  ) into summary;
  return summary;
end;
$$;

create or replace function public.retry_notification(notification_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.notifications
  set status = 'pending', attempts = 0, locked_at = null, last_error = null
  where id = notification_id
    and user_id = (select auth.uid())
    and status = 'failed';
  if not found then
    raise exception 'No se encontró un recordatorio fallido que puedas reintentar.';
  end if;
end;
$$;

create or replace function public.claim_due_notifications()
returns table (
  id uuid,
  user_id uuid,
  title text,
  message text,
  email_address text,
  scheduled_at timestamptz,
  attempts integer,
  name text
)
language sql
security definer
set search_path = ''
as $$
  with due as (
    select n.id
    from public.notifications n
    where (n.status = 'pending' and n.scheduled_at <= now())
       or (n.status = 'processing' and n.locked_at < now() - interval '10 minutes')
    order by n.scheduled_at
    limit 50
    for update skip locked
  ),
  claimed as (
    update public.notifications n
    set status = 'processing', locked_at = now(), attempts = n.attempts + 1
    from due
    where n.id = due.id
    returning n.id, n.user_id, n.title, n.message, n.email_address, n.scheduled_at, n.attempts
  )
  select c.id, c.user_id, c.title, c.message, c.email_address, c.scheduled_at, c.attempts, p.name
  from claimed c
  join public.profiles p on p.id = c.user_id;
$$;

create or replace function public.finish_notification(notification_id uuid, was_delivered boolean, failure_message text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.notifications
  set status = case
        when was_delivered then 'delivered'
        when attempts >= 3 then 'failed'
        else 'pending'
      end,
      delivered_at = case when was_delivered then now() else null end,
      last_error = case when was_delivered then null else left(coalesce(failure_message, 'No se pudo enviar el correo.'), 500) end,
      locked_at = null
  where id = notification_id and status = 'processing';
  if not found then
    raise exception 'El recordatorio no está en proceso.';
  end if;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_staff() from public, anon;
revoke all on function public.enforce_notification_limit() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_staff() to authenticated;
revoke all on function public.admin_list_users() from public, anon;
revoke all on function public.admin_change_user_role(text, text) from public, anon;
revoke all on function public.staff_report_summary() from public, anon;
revoke all on function public.retry_notification(uuid) from public, anon;
revoke all on function public.claim_due_notifications() from public, anon, authenticated;
revoke all on function public.finish_notification(uuid, boolean, text) from public, anon, authenticated;
grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_change_user_role(text, text) to authenticated;
grant execute on function public.staff_report_summary() to authenticated;
grant execute on function public.retry_notification(uuid) to authenticated;
grant execute on function public.claim_due_notifications() to service_role;
grant execute on function public.finish_notification(uuid, boolean, text) to service_role;
