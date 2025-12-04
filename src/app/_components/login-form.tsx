"use client";

import Link from "next/link";
import { useState } from "react";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    await login(formData);
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">
          ログイン
        </CardTitle>
        <CardDescription className="text-center">
          メールアドレスとパスワードを入力してください
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "ログイン中..." : "ログイン"}
          </Button>
          <p className="text-center text-muted-foreground text-sm">
            アカウント登録がまだの方は
            <Link
              href="/register"
              className="ml-1 text-primary underline underline-offset-4 hover:text-primary/80"
            >
              こちら
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
