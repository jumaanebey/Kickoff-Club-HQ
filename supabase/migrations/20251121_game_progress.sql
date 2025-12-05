-- Create game_progress table
create table if not exists public.game_progress (
  user_id uuid references auth.users not null,
  game_id text not null,
  high_score integer default 0,
  completed boolean default false,
  coins integer default 0,
  data jsonb default '{}'::jsonb,
  last_played_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, game_id)
);

-- Create game_scores table for leaderboards
create table if not exists public.game_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  game_id text not null,
  score integer not null,
  played_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.game_progress enable row level security;
alter table public.game_scores enable row level security;

-- Policies for game_progress
create policy "Users can view their own progress"
  on public.game_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own progress"
  on public.game_progress for all
  using (auth.uid() = user_id);

-- Policies for game_scores
create policy "Users can view all scores (for leaderboards)"
  on public.game_scores for select
  using (true);

create policy "Users can insert their own scores"
  on public.game_scores for insert
  with check (auth.uid() = user_id);
