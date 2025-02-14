import { createClient } from "@/app/utils/supabase/server";

export async function getLevels() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("levels").select("*");

  if (error) {
    throw new Error("Failed to fetch levels");
  }

  return data.map((level) => JSON.parse(JSON.stringify(level))); // Ensure plain objects
}
