-- Bảng plans
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

-- (Tùy chọn) Liên kết subscriptions với plans (nếu chưa có bảng subscriptions hoặc muốn mở rộng)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  price_id uuid not null references public.plans(id),
  status text not null default 'active', -- active | canceled | past_due | trialing
  current_period_start timestamptz default now(),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.subscriptions enable row level security;

-- Policies subscriptions (đơn giản: mọi member trong org xem được, chỉ owner thao tác)
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