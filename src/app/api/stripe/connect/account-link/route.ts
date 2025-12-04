import { NextResponse } from "next/server";
import { getStripe } from "@/utils/stripe";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Stripe account ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_account_id) {
      return NextResponse.json(
        { error: "No Stripe account found" },
        { status: 400 },
      );
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const stripe = getStripe();

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: profile.stripe_account_id,
      refresh_url: `${origin}/api/stripe/connect/refresh`,
      return_url: `${origin}/api/stripe/connect/return`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Account link creation error:", error);
    return NextResponse.json(
      { error: "Failed to create account link" },
      { status: 500 },
    );
  }
}
