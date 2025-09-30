-- Base schema definition (reordered full DDL)
-- This file intentionally excludes data seeding (see ./seeders/*.sql for seeds)
-- Uses pgcrypto.gen_random_uuid() for UUID defaults.

create extension if not exists pgcrypto;

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

-- SECURITY DEFINER function with fixed search_path to avoid hijack via malicious schemas
create or replace function public.create_org_with_owner(p_name text, p_slug text)
returns json
language plpgsql
security definer
set search_path = public, pg_temp
as $$
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
-- Plans (canonical list of subscription plans)
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,          -- 'free', 'pro'
  name text not null,
  description text,
  amount_cents int not null default 0,
  currency text not null default 'vnd',
  billing_interval text not null default 'month', -- month/year
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.plans enable row level security;
create policy plans_select on public.plans for select using (true);

-- (Plan seed data removed – see seeders/plans-seeder.sql)

-- Subscriptions referencing plans (one row per active subscription)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status text not null default 'active', -- active | canceled | past_due | trialing
  current_period_start timestamptz default now(),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.subscriptions enable row level security;

-- Policies: members can view, only owners can modify
create policy subscriptions_select on public.subscriptions
  for select using (
    exists (
      select 1 from public.memberships m
      where m.org_id = subscriptions.org_id
        and m.user_id = auth.uid()
    )
  );

create policy subscriptions_modify on public.subscriptions
  for all using (
    exists (
      select 1 from public.memberships m
      where m.org_id = subscriptions.org_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  ) with check (
    exists (
      select 1 from public.memberships m
      where m.org_id = subscriptions.org_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

-- Invoices (historical billing records per org)
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  plan_code text not null references public.plans(code),
  amount_cents int not null,
  currency text not null default 'vnd',
  status text not null default 'paid', -- paid | open | void | uncollectible | refunded
  period_start timestamptz,
  period_end timestamptz,
  issued_at timestamptz not null default now(),
  provider_invoice_id text,
  metadata jsonb default '{}'::jsonb
);
alter table public.invoices enable row level security;
create policy invoices_select on public.invoices
  for select using (
    exists(
      select 1 from public.memberships m
      where m.org_id = invoices.org_id and m.user_id = auth.uid()
    )
  );

-- Credit balances per org (e.g. promotional credits)
create table if not exists public.credit_balances (
  org_id uuid primary key references public.organizations(id) on delete cascade,
  cents int not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.credit_balances enable row level security;
create policy credit_balances_select on public.credit_balances
  for select using (
    exists(
      select 1 from public.memberships m
      where m.org_id = credit_balances.org_id and m.user_id = auth.uid()
    )
  );
create policy credit_balances_modify on public.credit_balances
  for all using (
    exists(
      select 1 from public.memberships m
      where m.org_id = credit_balances.org_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  ) with check (
    exists(
      select 1 from public.memberships m
      where m.org_id = credit_balances.org_id and m.user_id = auth.uid() and m.role = 'owner'
    )
  );

-- Optional helper: ensure a credit balance row exists when an org is created
create or replace function public.ensure_credit_balance()
returns trigger language plpgsql set search_path = public as $$
begin
  insert into public.credit_balances(org_id) values (new.id)
  on conflict (org_id) do nothing;
  return new;
end;$$;
drop trigger if exists organizations_credit_balance_init on public.organizations;
create trigger organizations_credit_balance_init
  after insert on public.organizations
  for each row execute procedure public.ensure_credit_balance();


-- Projects (workspaces under an organization)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz default now()
);
alter table public.projects enable row level security;

-- Policies: members of org can view, only owners can insert/update/delete
create policy projects_select on public.projects
  for select using (
    exists (
      select 1 from public.memberships m
      where m.org_id = projects.organization_id
        and m.user_id = auth.uid()
    )
  );

create policy projects_insert on public.projects
  for insert with check (
    exists (
      select 1 from public.memberships m
      where m.org_id = projects.organization_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

create policy projects_update on public.projects
  for update using (
    exists (
      select 1 from public.memberships m
      where m.org_id = projects.organization_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

create policy projects_delete on public.projects
  for delete using (
    exists (
      select 1 from public.memberships m
      where m.org_id = projects.organization_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );