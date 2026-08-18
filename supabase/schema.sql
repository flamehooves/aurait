-- AuraIT Database Schema
-- Run this in your Supabase SQL editor to initialize the database

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for username search

-- ─────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────
create type aura_difficulty as enum ('Easy', 'Medium', 'Hard', 'Legendary');
create type moment_visibility as enum ('public', 'friends', 'private');
create type friendship_status as enum ('pending', 'accepted', 'blocked');
create type notification_type as enum (
  'aura_received',
  'comment_received',
  'challenge_completed_friend',
  'friend_request',
  'friend_accepted',
  'streak_reminder',
  'leaderboard_moved',
  'level_reached',
  'challenge_milestone',
  'aura_adjustment'
);
create type challenge_status as enum ('in_progress', 'completed', 'abandoned');

-- ─────────────────────────────────────────────
-- User Profiles (extends auth.users)
-- ─────────────────────────────────────────────
create table public.user_profiles (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  username          text not null unique,
  display_name      text not null,
  bio               text,
  avatar_url        text,
  city              text,
  country           text,
  aura_score        integer not null default 0 check (aura_score >= 0),
  streak_current    integer not null default 0,
  streak_best       integer not null default 0,
  rank_friends      integer,
  rank_city         integer,
  city_percentile   integer,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create unique index user_profiles_user_id_idx on public.user_profiles(user_id);
create index user_profiles_username_trgm_idx on public.user_profiles using gin(username gin_trgm_ops);
create index user_profiles_aura_score_idx on public.user_profiles(aura_score desc);

-- ─────────────────────────────────────────────
-- Friendships
-- ─────────────────────────────────────────────
create table public.friendships (
  id             uuid primary key default uuid_generate_v4(),
  requester_id   uuid not null references public.user_profiles(id) on delete cascade,
  addressee_id   uuid not null references public.user_profiles(id) on delete cascade,
  status         friendship_status not null default 'pending',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint no_self_friendship check (requester_id <> addressee_id),
  constraint unique_friendship unique (requester_id, addressee_id)
);

create index friendships_addressee_idx on public.friendships(addressee_id);
create index friendships_requester_idx on public.friendships(requester_id);

-- ─────────────────────────────────────────────
-- Challenges
-- ─────────────────────────────────────────────
create table public.challenges (
  id                  uuid primary key default uuid_generate_v4(),
  title               text not null,
  description         text not null,
  task                text not null,
  difficulty          aura_difficulty not null,
  aura_reward         integer not null check (aura_reward > 0),
  streak_requirement  integer,
  participant_count   integer not null default 0,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Moments (Aura posts)
-- ─────────────────────────────────────────────
create table public.moments (
  id             uuid primary key default uuid_generate_v4(),
  author_id      uuid not null references public.user_profiles(id) on delete cascade,
  caption        text not null,
  media_url      text,
  media_type     text check (media_type in ('image', 'video')),
  aura_card      text,
  visibility     moment_visibility not null default 'friends',
  challenge_id   uuid references public.challenges(id) on delete set null,
  aura_count     integer not null default 0,
  comment_count  integer not null default 0,
  created_at     timestamptz not null default now()
);

create index moments_author_idx on public.moments(author_id);
create index moments_created_at_idx on public.moments(created_at desc);
create index moments_challenge_idx on public.moments(challenge_id) where challenge_id is not null;

-- ─────────────────────────────────────────────
-- Aura Given (one per user per moment)
-- ─────────────────────────────────────────────
create table public.aura_given (
  id          uuid primary key default uuid_generate_v4(),
  moment_id   uuid not null references public.moments(id) on delete cascade,
  giver_id    uuid not null references public.user_profiles(id) on delete cascade,
  amount      integer not null check (amount between 10 and 30),
  created_at  timestamptz not null default now(),
  constraint unique_aura_per_moment unique (moment_id, giver_id)
);

create index aura_given_moment_idx on public.aura_given(moment_id);
create index aura_given_giver_idx on public.aura_given(giver_id);

-- ─────────────────────────────────────────────
-- Aura Ledger (immutable audit log)
-- ─────────────────────────────────────────────
create table public.aura_ledger (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references public.user_profiles(id) on delete cascade,
  amount                integer not null,
  reason                text not null,
  description           text not null,
  related_moment_id     uuid references public.moments(id) on delete set null,
  related_user_id       uuid references public.user_profiles(id) on delete set null,
  related_challenge_id  uuid references public.challenges(id) on delete set null,
  created_at            timestamptz not null default now()
);

create index aura_ledger_user_idx on public.aura_ledger(user_id, created_at desc);

-- ─────────────────────────────────────────────
-- Challenge Progress
-- ─────────────────────────────────────────────
create table public.challenge_progress (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.user_profiles(id) on delete cascade,
  challenge_id   uuid not null references public.challenges(id) on delete cascade,
  status         challenge_status not null default 'in_progress',
  started_at     timestamptz not null default now(),
  completed_at   timestamptz,
  constraint unique_challenge_per_user unique (user_id, challenge_id)
);

create index challenge_progress_user_idx on public.challenge_progress(user_id);

-- ─────────────────────────────────────────────
-- Comments
-- ─────────────────────────────────────────────
create table public.comments (
  id           uuid primary key default uuid_generate_v4(),
  moment_id    uuid not null references public.moments(id) on delete cascade,
  author_id    uuid not null references public.user_profiles(id) on delete cascade,
  body         text not null,
  is_positive  boolean,
  created_at   timestamptz not null default now()
);

create index comments_moment_idx on public.comments(moment_id, created_at asc);

-- ─────────────────────────────────────────────
-- Notifications
-- ─────────────────────────────────────────────
create table public.notifications (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references public.user_profiles(id) on delete cascade,
  type                  notification_type not null,
  from_user_id          uuid references public.user_profiles(id) on delete set null,
  title                 text not null,
  body                  text not null,
  related_moment_id     uuid references public.moments(id) on delete set null,
  related_challenge_id  uuid references public.challenges(id) on delete set null,
  is_read               boolean not null default false,
  created_at            timestamptz not null default now()
);

create index notifications_user_unread_idx on public.notifications(user_id, is_read, created_at desc);

-- ─────────────────────────────────────────────
-- Aura Opportunities
-- ─────────────────────────────────────────────
create table public.aura_opportunities (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text not null,
  aura_reward  integer not null check (aura_reward > 0),
  expires_at   timestamptz,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Triggers: updated_at
-- ─────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();

create trigger friendships_updated_at
  before update on public.friendships
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────
-- Trigger: auto-create profile on signup
-- ─────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (user_id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- Trigger: sync aura_score from ledger
-- ─────────────────────────────────────────────
create or replace function public.sync_aura_score()
returns trigger language plpgsql as $$
begin
  update public.user_profiles
  set aura_score = greatest(0, aura_score + new.amount)
  where id = new.user_id;
  return new;
end;
$$;

create trigger aura_ledger_sync_score
  after insert on public.aura_ledger
  for each row execute function public.sync_aura_score();

-- ─────────────────────────────────────────────
-- Trigger: sync moment aura_count
-- ─────────────────────────────────────────────
create or replace function public.sync_moment_aura_count()
returns trigger language plpgsql as $$
begin
  if (TG_OP = 'INSERT') then
    update public.moments set aura_count = aura_count + new.amount where id = new.moment_id;
  elsif (TG_OP = 'DELETE') then
    update public.moments set aura_count = greatest(0, aura_count - old.amount) where id = old.moment_id;
  end if;
  return null;
end;
$$;

create trigger aura_given_sync_count
  after insert or delete on public.aura_given
  for each row execute function public.sync_moment_aura_count();

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table public.user_profiles enable row level security;
alter table public.moments enable row level security;
alter table public.aura_given enable row level security;
alter table public.aura_ledger enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_progress enable row level security;
alter table public.friendships enable row level security;
alter table public.comments enable row level security;
alter table public.notifications enable row level security;
alter table public.aura_opportunities enable row level security;

-- user_profiles: public read, own write
create policy "profiles_public_read" on public.user_profiles for select using (true);
create policy "profiles_own_insert" on public.user_profiles for insert with check (auth.uid() = user_id);
create policy "profiles_own_update" on public.user_profiles for update using (auth.uid() = user_id);

-- moments: public / friends read based on visibility, own write
create policy "moments_public_read" on public.moments for select using (visibility = 'public');
create policy "moments_own_read" on public.moments for select using (
  auth.uid() = (select user_id from public.user_profiles where id = author_id)
);
create policy "moments_own_write" on public.moments for insert with check (
  auth.uid() = (select user_id from public.user_profiles where id = author_id)
);
create policy "moments_own_delete" on public.moments for delete using (
  auth.uid() = (select user_id from public.user_profiles where id = author_id)
);

-- aura_given: authenticated read, own write (one per moment enforced by unique constraint)
create policy "aura_given_read" on public.aura_given for select using (auth.uid() is not null);
create policy "aura_given_insert" on public.aura_given for insert with check (
  auth.uid() = (select user_id from public.user_profiles where id = giver_id)
);
create policy "aura_given_delete" on public.aura_given for delete using (
  auth.uid() = (select user_id from public.user_profiles where id = giver_id)
);

-- aura_ledger: own read only (write via triggers/functions)
create policy "ledger_own_read" on public.aura_ledger for select using (
  auth.uid() = (select user_id from public.user_profiles where id = aura_ledger.user_id)
);

-- challenges: public read
create policy "challenges_read" on public.challenges for select using (true);

-- challenge_progress: own read/write
create policy "progress_own_read" on public.challenge_progress for select using (
  auth.uid() = (select user_id from public.user_profiles where id = challenge_progress.user_id)
);
create policy "progress_own_write" on public.challenge_progress for insert with check (
  auth.uid() = (select user_id from public.user_profiles where id = challenge_progress.user_id)
);
create policy "progress_own_update" on public.challenge_progress for update using (
  auth.uid() = (select user_id from public.user_profiles where id = challenge_progress.user_id)
);

-- friendships: own read/write
create policy "friendships_read" on public.friendships for select using (
  auth.uid() = (select user_id from public.user_profiles where id = requester_id) or
  auth.uid() = (select user_id from public.user_profiles where id = addressee_id)
);
create policy "friendships_insert" on public.friendships for insert with check (
  auth.uid() = (select user_id from public.user_profiles where id = requester_id)
);
create policy "friendships_update" on public.friendships for update using (
  auth.uid() = (select user_id from public.user_profiles where id = addressee_id)
);

-- comments: public read, own write
create policy "comments_read" on public.comments for select using (true);
create policy "comments_insert" on public.comments for insert with check (
  auth.uid() = (select user_id from public.user_profiles where id = author_id)
);
create policy "comments_delete" on public.comments for delete using (
  auth.uid() = (select user_id from public.user_profiles where id = author_id)
);

-- notifications: own read/update only
create policy "notifs_own_read" on public.notifications for select using (
  auth.uid() = (select user_id from public.user_profiles where id = notifications.user_id)
);
create policy "notifs_own_update" on public.notifications for update using (
  auth.uid() = (select user_id from public.user_profiles where id = notifications.user_id)
);

-- aura_opportunities: public read
create policy "opportunities_read" on public.aura_opportunities for select using (is_active = true);
