import { createClient } from "@/app/utils/supabase/server";

export default async function getSchoolIdForUser(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("administrators")
    .select("school_id")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.error("Error fetching school ID for user:", error);
    throw new Error("Failed to fetch school ID for the user");
  }

  return data.school_id;
}

