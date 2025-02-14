import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import ModeratorsPageClient from "./ModeratorsPageClient";
import getSchoolIdForUser from "@/app/utils/supabase/schools";
import { fetchModerators } from "@/app/utils/supabase/moderators";

export default async function ModeratorsPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  const schoolId = await getSchoolIdForUser(user.id);

  const moderators = await fetchModerators(schoolId);

  // Convertir a objetos planos antes de pasarlos
  const plainModerators = JSON.parse(JSON.stringify(moderators || []));

  return <ModeratorsPageClient initialModerators={plainModerators} schoolId={schoolId} />;
}
