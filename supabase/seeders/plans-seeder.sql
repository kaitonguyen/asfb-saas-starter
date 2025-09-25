-- Seed plans
insert into public.plans (code, name, description, amount_cents, currency, billing_interval)
values
  ('free', 'Free', 'Gói miễn phí cơ bản', 0, 'vnd', 'month'),
  ('pro', 'Pro', 'Gói chuyên nghiệp', 1900, 'vnd', 'month')
on conflict (code) do update
  set name = excluded.name,
      description = excluded.description,
      amount_cents = excluded.amount_cents,
      currency = excluded.currency,
      billing_interval = excluded.billing_interval,
      is_active = true;