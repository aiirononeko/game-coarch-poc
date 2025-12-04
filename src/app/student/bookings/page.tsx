import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function StudentBookingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
      id,
      amount,
      status,
      created_at,
      plans (
        title,
        duration_minutes
      ),
      coach:profiles!bookings_coach_id_fkey (
        display_name,
        avatar_url
      )
    `,
    )
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">マイページ / 予約履歴</h1>

      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {(
                    booking.plans as unknown as {
                      title: string;
                      duration_minutes: number;
                    } | null
                  )?.title ?? "プラン情報なし"}
                </p>
                <p className="text-sm text-gray-600">
                  コーチ:{" "}
                  {(
                    booking.coach as unknown as {
                      display_name: string;
                      avatar_url: string | null;
                    } | null
                  )?.display_name ?? "不明"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.created_at).toLocaleDateString("ja-JP")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">¥{booking.amount.toLocaleString()}</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    booking.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.status === "paid"
                    ? "支払済"
                    : booking.status === "completed"
                      ? "完了"
                      : booking.status === "cancelled"
                        ? "キャンセル"
                        : "保留中"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">予約履歴がありません。</p>
      )}
    </main>
  );
}
