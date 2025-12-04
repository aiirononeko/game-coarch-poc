-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('coach', 'student')),
  display_name text,
  avatar_url text,
  bio text,
  stripe_account_id text unique,
  stripe_onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- Create plans table
create table public.plans (
  id uuid not null default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  price integer not null check (price >= 0),
  duration_minutes integer not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- Create bookings table
create table public.bookings (
  id uuid not null default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  coach_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  amount integer not null,
  application_fee_amount integer not null,
  transfer_amount integer not null,
  currency text default 'jpy',
  status text default 'pending' check (status in ('pending', 'paid', 'completed', 'cancelled')),
  stripe_payment_intent_id text unique,
  session_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.bookings enable row level security;

-- RLS Policies for profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- RLS Policies for plans
create policy "Plans are viewable by everyone."
  on public.plans for select
  using ( true );

create policy "Coaches can insert their own plans."
  on public.plans for insert
  with check ( auth.uid() = coach_id );

create policy "Coaches can update their own plans."
  on public.plans for update
  using ( auth.uid() = coach_id );

create policy "Coaches can delete their own plans."
  on public.plans for delete
  using ( auth.uid() = coach_id );

-- RLS Policies for bookings
create policy "Users can view their own bookings (as student or coach)."
  on public.bookings for select
  using ( auth.uid() = student_id or auth.uid() = coach_id );

create policy "Students can insert bookings."
  on public.bookings for insert
  with check ( auth.uid() = student_id );

create policy "Users can update their own bookings."
  on public.bookings for update
  using ( auth.uid() = student_id or auth.uid() = coach_id );

-- Trigger for handle_new_user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'), -- Default to student if not specified
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_plans_updated_at
  before update on public.plans
  for each row execute procedure public.handle_updated_at();

create trigger handle_bookings_updated_at
  before update on public.bookings
  for each row execute procedure public.handle_updated_at();
