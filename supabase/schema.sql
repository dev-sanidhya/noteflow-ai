-- Users are managed by Supabase Auth (auth.users)
-- We create a profiles table that extends it

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled',
  content text not null default '',
  tags text[] default '{}',
  category text default 'General',
  is_archived boolean default false,
  is_public boolean default false,
  share_id text unique,
  ai_summary text,
  ai_action_items text[],
  ai_suggested_title text,
  ai_generated_at timestamptz,
  ai_generation_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for search
create index notes_user_id_idx on public.notes(user_id);
create index notes_share_id_idx on public.notes(share_id);
create index notes_tags_idx on public.notes using gin(tags);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.notes enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own notes" on public.notes for select using (auth.uid() = user_id);
create policy "Users can insert own notes" on public.notes for insert with check (auth.uid() = user_id);
create policy "Users can update own notes" on public.notes for update using (auth.uid() = user_id);
create policy "Users can delete own notes" on public.notes for delete using (auth.uid() = user_id);

-- Public notes viewable by anyone
create policy "Public notes viewable by all" on public.notes for select using (is_public = true);

-- Trigger to auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger notes_updated_at before update on public.notes
  for each row execute function update_updated_at();

-- Trigger to auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
