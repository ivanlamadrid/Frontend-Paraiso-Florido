import { Suspense } from "react";
import { createClient } from "@/app/utils/supabase/server";
import DashboardContent from "./DashboardContent";
import DashboardSkeleton from "./DashboardSkeleton";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: attendanceData } = await supabase.from("attendance").select("date, check_in").order("date", { ascending: false }).limit(100);
  const { count: studentsCount } = await supabase.from("students").select("id", { count: "exact", head: true });

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent attendanceData={attendanceData || []} totalStudents={studentsCount || 0} />
    </Suspense>
  );
}
