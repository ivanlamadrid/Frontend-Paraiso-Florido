import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import CredentialsPageClient from "./CredentialsPageClient";

export default async function CredentialsPage() {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

  return <CredentialsPageClient />;
}
