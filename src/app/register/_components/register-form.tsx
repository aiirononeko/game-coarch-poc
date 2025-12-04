"use client";

import Link from "next/link";
import { useState } from "react";
import { signup } from "@/app/auth/actions";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    await signup(formData);
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">
          アカウント登録
        </CardTitle>
        <CardDescription className="text-center">
          必要な情報を入力してアカウントを作成してください
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
              minLength={6}
            />
          </div>
          <div className="space-y-3">
            <Label>アカウントの種類</Label>
            <RadioGroup defaultValue="student" name="role" className="gap-3">
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <RadioGroupItem value="student" id="student" />
                <div className="flex-1">
                  <Label
                    htmlFor="student"
                    className="cursor-pointer font-medium"
                  >
                    生徒として登録
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    コーチからレッスンを受けたい方
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <RadioGroupItem value="coach" id="coach" />
                <div className="flex-1">
                  <Label htmlFor="coach" className="cursor-pointer font-medium">
                    コーチとして登録
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    コーチングサービスを提供したい方
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "登録中..." : "アカウントを作成"}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            すでにアカウントをお持ちの方は
            <Link
              href="/"
              className="ml-1 text-primary underline underline-offset-4 hover:text-primary/80"
            >
              ログイン
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
