import { redirect } from "next/navigation";
import { getStripe } from "@/utils/stripe";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Get Stripe account ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_account_id) {
    redirect("/coach/dashboard?error=no_account");
  }

  try {
    const stripe = getStripe();

    // Retrieve account to check status
    const account = await stripe.accounts.retrieve(profile.stripe_account_id);

    // Update onboarding status if details are submitted
    if (account.details_submitted) {
      await supabase
        .from("profiles")
        .update({ stripe_onboarding_completed: true })
        .eq("id", user.id);

      redirect("/coach/dashboard?stripe=connected");
    }

    // If not completed, redirect back to dashboard with pending status
    redirect("/coach/dashboard?stripe=pending");
  } catch (error) {
    console.error("Stripe account retrieval error:", error);
    redirect("/coach/dashboard?error=stripe_error");
  }
}
