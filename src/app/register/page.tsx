import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { RegisterForm } from "./_components/register-form";

export default async function RegisterPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 既にログイン済みの場合はリダイレクト
  if (user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-6">
      <div className="mb-8 space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Game Coach</h1>
        <p className="text-muted-foreground">
          ゲームコーチングプラットフォーム
        </p>
      </div>
      <RegisterForm />
    </main>
  );
}
