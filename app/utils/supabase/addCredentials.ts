import { createClient } from "@/app/utils/supabase/server";
import bcrypt from "bcryptjs";

export async function addCredentials(
  schoolId: string,
  entityId: string,
  identity: string,
  entityType: "student" | "moderator"
) {
  const supabase = await createClient();
  const tableName = entityType === "student" ? "student_credentials" : "moderator_credentials";

  // Hasheamos la contraseña usando bcrypt (12 rondas)
  const hashedPassword = await bcrypt.hash(identity, 12);

  const { error } = await supabase.from(tableName).insert([
    {
      school_id: schoolId,
      [`${entityType}_id`]: entityId,
      username: identity,
      password: hashedPassword,  // Guardamos la contraseña hasheada
    },
  ]);

  if (error) {
    console.error(`Error adding ${entityType} credentials:`, error);
    throw new Error(`Failed to add ${entityType} credentials.`);
  }
}
