-- Remove the automatic profile creation trigger
-- Profiles will be created in the auth callback after email verification

-- Drop the trigger first
drop trigger if exists on_auth_user_created on auth.users;

-- Drop the function
drop function if exists public.handle_new_user();
