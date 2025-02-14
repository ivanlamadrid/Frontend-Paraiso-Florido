// utils/supabase/addStudent.ts

import { createClient } from "@/app/utils/supabase/server";
import { addCredentials } from "./addCredentials"; // Importamos la función genérica.
import type { Student } from "@/app/types/student";

type NewStudent = Omit<Student, "id" | "created_at" | "school_id">;

export async function addStudent(schoolId: string, studentData: NewStudent) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .insert([{ ...studentData, school_id: schoolId }])
    .select();

  if (error) {
    console.error("Error inserting student:", error);
    throw new Error("Failed to add student");
  }

  const newStudent = data[0];

  // Agregamos las credenciales del estudiante con la contraseña hasheada.
  await addCredentials(schoolId, newStudent.id, newStudent.identity!, "student");

  return newStudent;
}
