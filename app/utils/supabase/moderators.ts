import { createClient } from "@/app/utils/supabase/server";
import { makePlainObject } from "../helpers";
import { addCredentials } from "./addCredentials";

export interface Moderator {
  id?: string;
  given_name: string;
  identity: string;
  school_id: string;
  created_at?: string;
}

export async function createModerator(moderator: Omit<Moderator, "id" | "created_at">) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("moderators").insert([moderator]).select();

  if (error) {
    console.error("Error creating moderator:", error);
    throw new Error("Failed to create moderator");
  }

  const newModerator = data[0];

  // Agregamos las credenciales del moderador con la contraseña hasheada.
  await addCredentials(newModerator.school_id, newModerator.id!, newModerator.identity, "moderator");
}

export async function updateModerator(moderatorId: string, updatedData: Partial<Moderator>): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("moderators").update(updatedData).eq("id", moderatorId);

  if (error) {
    console.error("Error updating moderator:", error);
    throw new Error("Failed to update moderator");
  }
}

export async function fetchModerators(schoolId: string): Promise<Moderator[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("moderators").select("*").eq("school_id", schoolId);

  if (error) {
    console.error("Error fetching moderators:", error);
    throw new Error("Failed to fetch moderators");
  }

  // Convertir los moderadores a objetos planos antes de devolverlos
  return JSON.parse(JSON.stringify(data || []));
}


export async function deleteModerator(moderatorId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("moderators").delete().eq("id", moderatorId);

  if (error) {
    console.error("Error deleting moderator:", error);
    throw new Error("Failed to delete moderator");
  }

  // Retornamos un resultado plano
  return makePlainObject({ success: true });
}
