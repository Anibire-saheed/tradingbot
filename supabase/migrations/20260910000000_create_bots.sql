create table public.bots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  creator_email text,
  creator_username text,
  name text not null check (char_length(trim(name)) between 2 and 60),
  strategy text not null check (strategy in ('Trend following', 'Dollar-cost averaging', 'Buy the dip')),
  asset text not null check (asset in ('BTC', 'ETH', 'SOL')),
  budget numeric not null check (budget between 10 and 1000000),
  stop_loss numeric not null check (stop_loss between 1 and 50),
  created_at timestamptz not null default now()
);

create index bots_user_created_at_idx on public.bots(user_id, created_at);

-- Capture account details at creation; clients cannot supply another identity.
create function public.set_bot_creator()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select email, coalesce(
    nullif(raw_user_meta_data ->> 'username', ''),
    nullif(raw_user_meta_data ->> 'full_name', ''),
    split_part(email, '@', 1)
  ) into new.creator_email, new.creator_username
  from auth.users where id = new.user_id;
  return new;
end;
$$;

revoke all on function public.set_bot_creator() from public, anon, authenticated;
create trigger bots_set_creator before insert on public.bots
for each row execute function public.set_bot_creator();

alter table public.bots enable row level security;
revoke all on public.bots from anon, authenticated;
grant select, insert, delete on public.bots to authenticated;
grant all on public.bots to service_role;

create policy "Read own bots" on public.bots for select to authenticated
using ((select auth.uid()) = user_id);
create policy "Create own bots" on public.bots for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "Delete own bots" on public.bots for delete to authenticated
using ((select auth.uid()) = user_id);
