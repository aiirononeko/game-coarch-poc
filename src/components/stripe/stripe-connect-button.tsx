"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface StripeConnectButtonProps {
  hasAccount?: boolean;
}

export function StripeConnectButton({
  hasAccount = false,
}: StripeConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);

    try {
      // Step 1: Create account if doesn't exist
      if (!hasAccount) {
        const accountRes = await fetch("/api/stripe/connect/account", {
          method: "POST",
        });

        if (!accountRes.ok) {
          throw new Error("Failed to create account");
        }
      }

      // Step 2: Get onboarding link
      const linkRes = await fetch("/api/stripe/connect/account-link", {
        method: "POST",
      });

      if (!linkRes.ok) {
        throw new Error("Failed to create onboarding link");
      }

      const { url } = await linkRes.json();

      // Redirect to Stripe onboarding
      window.location.href = url;
    } catch (error) {
      console.error("Stripe connect error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleConnect}
      disabled={isLoading}
    >
      {isLoading ? "処理中..." : "Stripe連携する"}
    </Button>
  );
}
