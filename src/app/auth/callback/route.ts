import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const {
      data: { user },
      error: exchangeError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError || !user) {
      console.error(
        "Error exchanging code for session:",
        exchangeError?.message,
      );
      return NextResponse.redirect(`${origin}/error`);
    }

    // Get user role from metadata
    const role = user.user_metadata?.role || "student";

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    // Create profile if it doesn't exist (email confirmation completed)
    if (!existingProfile) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        role: role,
        display_name: user.user_metadata?.display_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      });

      if (profileError) {
        console.error("Error creating profile:", profileError.message);
        return NextResponse.redirect(`${origin}/error`);
      }
    }

    // Redirect based on role
    if (role === "coach") {
      return NextResponse.redirect(`${origin}/coach/dashboard`);
    } else {
      return NextResponse.redirect(`${origin}/student/bookings`);
    }
  }

  // No code provided, redirect to home
  return NextResponse.redirect(`${origin}/`);
}
