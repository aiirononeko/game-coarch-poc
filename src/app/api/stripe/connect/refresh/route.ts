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
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const stripe = getStripe();

    // Create new account link
    const accountLink = await stripe.accountLinks.create({
      account: profile.stripe_account_id,
      refresh_url: `${origin}/api/stripe/connect/refresh`,
      return_url: `${origin}/api/stripe/connect/return`,
      type: "account_onboarding",
    });

    redirect(accountLink.url);
  } catch (error) {
    console.error("Account link refresh error:", error);
    redirect("/coach/dashboard?error=refresh_failed");
  }
}
