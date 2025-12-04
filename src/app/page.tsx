import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/auth-form";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile) {
      if (profile.role === "coach") {
        redirect("/coach/dashboard");
      } else if (profile.role === "student") {
        redirect("/student/bookings");
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Game Coach PoC</h1>
      <AuthForm />
    </main>
  );
}
