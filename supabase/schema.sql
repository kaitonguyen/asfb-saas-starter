-- Organizations and memberships for multi-tenant
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

-- Enable RLS
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;

-- Policies
create policy if not exists orgs_select on public.organizations
  for select using (
    exists(
      select 1 from public.memberships m
      where m.org_id = organizations.id and m.user_id = auth.uid()
    )
  );

create policy if not exists memberships_select on public.memberships
  for select using (user_id = auth.uid());

-- Allow users to see their org memberships and read orgs they belong to.

-- Insert policies
create policy if not exists orgs_insert on public.organizations
  for insert to authenticated with check (true);

create policy if not exists memberships_insert on public.memberships
  for insert to authenticated with check (user_id = auth.uid());

-- Helper function to create org and owner membership
create or replace function public.create_org_with_owner(p_name text, p_slug text)
returns json language plpgsql security definer as $$
declare
  v_org public.organizations;
begin
  insert into public.organizations(name, slug) values (p_name, p_slug)
  returning * into v_org;

  insert into public.memberships(org_id, user_id, role)
  values (v_org.id, auth.uid(), 'owner');

  return json_build_object('id', v_org.id, 'name', v_org.name, 'slug', v_org.slug);
end;
$$;
