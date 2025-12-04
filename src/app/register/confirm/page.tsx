"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterConfirmPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-6">
      <div className="mb-8 space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Game Coach</h1>
        <p className="text-muted-foreground">
          ゲームコーチングプラットフォーム
        </p>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-bold text-2xl">
            メールをご確認ください
          </CardTitle>
          <CardDescription>
            アカウントの認証を完了するため、メールをご確認ください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>認証メールを送信しました</AlertTitle>
            <AlertDescription>
              ご登録いただいたメールアドレスに認証リンクを送信しました。
              メール内のリンクをクリックして、アカウントの認証を完了してください。
            </AlertDescription>
          </Alert>
          <div className="text-center text-muted-foreground text-sm">
            <p>メールが届かない場合は、迷惑メールフォルダをご確認ください。</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">ログインページに戻る</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
