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

    // Check if user is a coach
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, stripe_account_id")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "coach") {
      return NextResponse.json(
        { error: "Only coaches can create Stripe accounts" },
        { status: 403 },
      );
    }

    // If already has Stripe account, return it
    if (profile.stripe_account_id) {
      return NextResponse.json({
        accountId: profile.stripe_account_id,
        alreadyExists: true,
      });
    }

    const stripe = getStripe();

    // Create Express account
    const account = await stripe.accounts.create({
      type: "express",
      country: "JP",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      metadata: {
        user_id: user.id,
      },
    });

    // Save account ID to profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_account_id: account.id })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to save Stripe account ID:", updateError);
      return NextResponse.json(
        { error: "Failed to save account" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      accountId: account.id,
      alreadyExists: false,
    });
  } catch (error) {
    console.error("Stripe account creation error:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe account" },
      { status: 500 },
    );
  }
}
