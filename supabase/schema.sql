-- Organizations and memberships for multi-tenant
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.memberships (
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
create policy orgs_select on public.organizations
  for select using (
    exists(
      select 1 from public.memberships m
      where m.org_id = organizations.id and m.user_id = auth.uid()
    )
  );

create policy memberships_select on public.memberships
  for select using (user_id = auth.uid());

-- Allow users to see their org memberships and read orgs they belong to.

-- Insert policies
create policy orgs_insert on public.organizations
  for insert to authenticated with check (true);

create policy memberships_insert on public.memberships
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

-- Subscriptions: org-level billing information
create table public.subscriptions (
  org_id uuid primary key references public.organizations(id) on delete cascade,
  plan text not null default 'free',
  status text not null default 'inactive', -- inactive | active | trialing | past_due | canceled
  provider text default 'stripe', -- billing provider identifier (optional)
  price_id text, -- provider price id
  customer_id text, -- provider customer id
  subscription_id text, -- provider subscription id
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS for subscriptions
alter table public.subscriptions enable row level security;

-- Anyone in the org can read subscription
create policy subscriptions_select on public.subscriptions
  for select using (
    exists(
      select 1 from public.memberships m
      where m.org_id = subscriptions.org_id and m.user_id = auth.uid()
    )
  );

-- Only org owner can insert/update/delete subscription rows
create policy subscriptions_insert on public.subscriptions
  for insert to authenticated with check (
    exists(
      select 1 from public.memberships m
      where m.org_id = subscriptions.org_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

create policy subscriptions_update on public.subscriptions
  for update to authenticated using (
    exists(
      select 1 from public.memberships m
      where m.org_id = subscriptions.org_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  ) with check (
    exists(
      select 1 from public.memberships m
      where m.org_id = subscriptions.org_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

create policy subscriptions_delete on public.subscriptions
  for delete to authenticated using (
    exists(
      select 1 from public.memberships m
      where m.org_id = subscriptions.org_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  );
