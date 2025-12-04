import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type BookingWithRelations = Tables<"bookings"> & {
  plans: Pick<Tables<"plans">, "title" | "duration_minutes"> | null;
  student: Pick<Tables<"profiles">, "display_name" | "avatar_url"> | null;
};

function getStatusBadgeVariant(
  status: string | null,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "paid":
      return "default";
    case "completed":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

function getStatusLabel(status: string | null): string {
  switch (status) {
    case "paid":
      return "支払済";
    case "completed":
      return "完了";
    case "cancelled":
      return "キャンセル";
    case "pending":
      return "保留中";
    default:
      return "不明";
  }
}

export default async function CoachDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Get coach profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "coach") {
    redirect("/");
  }

  // Get recent bookings (last 10)
  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
      id,
      amount,
      transfer_amount,
      application_fee_amount,
      status,
      created_at,
      plans (
        title,
        duration_minutes
      ),
      student:profiles!bookings_student_id_fkey (
        display_name,
        avatar_url
      )
    `,
    )
    .eq("coach_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<BookingWithRelations[]>();

  // Calculate this month's revenue
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: monthlyBookings } = await supabase
    .from("bookings")
    .select("transfer_amount, status")
    .eq("coach_id", user.id)
    .in("status", ["paid", "completed"])
    .gte("created_at", startOfMonth.toISOString());

  const monthlyRevenue =
    monthlyBookings?.reduce(
      (sum, booking) => sum + (booking.transfer_amount || 0),
      0,
    ) ?? 0;

  const totalBookingsThisMonth = monthlyBookings?.length ?? 0;

  // Calculate total revenue
  const { data: allBookings } = await supabase
    .from("bookings")
    .select("transfer_amount, status")
    .eq("coach_id", user.id)
    .in("status", ["paid", "completed"]);

  const totalRevenue =
    allBookings?.reduce(
      (sum, booking) => sum + (booking.transfer_amount || 0),
      0,
    ) ?? 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                コーチダッシュボード
              </h1>
              <p className="text-muted-foreground">
                {profile.display_name
                  ? `ようこそ、${profile.display_name}さん`
                  : "ようこそ"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {profile.stripe_onboarding_completed ? (
                <Badge variant="default" className="bg-green-600">
                  Stripe 連携済
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-amber-500 text-amber-600"
                >
                  Stripe 未連携
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Revenue Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-600">
                今月の売上
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                ¥{monthlyRevenue.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {totalBookingsThisMonth} 件の予約
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-600">
                累計売上
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                ¥{totalRevenue.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {allBookings?.length ?? 0} 件の取引
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-purple-600">
                Stripeダッシュボード
              </CardDescription>
              <CardTitle className="text-lg">売上詳細を確認</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.stripe_onboarding_completed ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href="https://dashboard.stripe.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Stripeを開く →
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="default" size="sm">
                  <Link href="/coach/settings">Stripe連携する</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>直近の予約</CardTitle>
                <CardDescription>最新10件の予約を表示</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/coach/bookings">すべて見る</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {bookings && bookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>生徒</TableHead>
                    <TableHead>プラン</TableHead>
                    <TableHead>金額</TableHead>
                    <TableHead>あなたの報酬</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>日時</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.student?.display_name ?? "不明"}
                      </TableCell>
                      <TableCell>
                        {booking.plans?.title ?? "プラン情報なし"}
                      </TableCell>
                      <TableCell>¥{booking.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600 font-medium">
                        ¥{booking.transfer_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {booking.created_at
                          ? new Date(booking.created_at).toLocaleDateString(
                              "ja-JP",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "日付不明"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  まだ予約がありません
                </p>
                <Button asChild variant="outline">
                  <Link href="/coach/plans">プランを作成する</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 mt-8">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link href="/coach/plans">
              <CardHeader>
                <CardTitle className="text-lg">プラン管理</CardTitle>
                <CardDescription>コーチングプランの作成・編集</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link href="/coach/settings">
              <CardHeader>
                <CardTitle className="text-lg">設定</CardTitle>
                <CardDescription>
                  プロフィール・Stripe連携の設定
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
}
