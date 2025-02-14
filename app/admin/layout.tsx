import ClientAdminLayout from "./ClientAdminLayout"; // Import the client layout
import getSchoolIdForUser from "@/app/utils/supabase/schools";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const schoolId = await getSchoolIdForUser(user.id);

  return (
    <ClientAdminLayout user={user} schoolId={schoolId}>
      {children}
    </ClientAdminLayout>
  );
}
