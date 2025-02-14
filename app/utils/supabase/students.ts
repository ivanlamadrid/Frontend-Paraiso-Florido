import { createClient as createClientInClient } from "@/app/utils/supabase/client"; // For client components
import { createClient as createClientInServer } from "@/app/utils/supabase/server"; // For server components
import type { Student } from "@/app/types/student";
import getSchoolIdForUser from "./schools";
import { makePlainObject } from "../helpers";

/**
 * Fetch students using client-side Supabase client.
 */
export async function fetchStudentsInClient(schoolId: string) {
  const supabase = createClientInClient();
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("school_id", schoolId);

  if (error) {
    console.error("Error fetching students (client):", error);
    throw new Error("Failed to fetch students in client");
  }

  return students.map(makePlainObject); // Convertimos todos los objetos
}


/**
 * Fetch students for SSR using server-side Supabase client.
 */
export async function getStudentsForCurrentUser(userId: string) {
  const schoolId = await getSchoolIdForUser(userId);
  const supabase = await createClientInServer();

  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("school_id", schoolId);

  if (error) {
    throw new Error("Failed to fetch students");
  }

  return students.map((student) => JSON.parse(JSON.stringify(student))); // Ensure plain objects
}


/**
 * Create a student using the client-side Supabase client.
 */
export async function createStudentInClient(
  schoolId: string,
  studentData: Omit<Student, "id" | "created_at" | "school_id">
) {
  const supabase = createClientInClient();
  const { data, error } = await supabase
    .from("students")
    .insert([{ ...studentData, school_id: schoolId }])
    .select()
    .single();

  if (error) {
    console.error("Error creating student (client):", error);
    throw new Error("Failed to create student");
  }

  return data;
}

/**
 * Create a student using the server-side Supabase client.
 */
// students.ts
export async function createStudentForCurrentUser(
  schoolId: string,
  studentData: Omit<Student, "id" | "created_at" | "school_id">
) {
  const supabase = await createClientInServer();

  const cleanStudentData = JSON.parse(JSON.stringify(studentData));

  const { data, error } = await supabase
    .from("students")
    .insert([{ ...cleanStudentData, school_id: schoolId }])
    .select()
    .single();

  if (error) {
    console.error("Error creating student (server):", error);
    throw new Error("Failed to create student");
  }

  return makePlainObject(data); // Aseguramos que sea plano
}

/**
 * Update a student using the server-side Supabase client.
 */
export async function updateStudentForCurrentUser(
  schoolId: string,
  studentId: string,
  updates: Partial<Student>
) {
  const supabase = await createClientInServer();

  const { data, error } = await supabase
    .from("students")
    .update(updates)
    .eq("id", studentId)
    .eq("school_id", schoolId) // Ensure it belongs to the correct school
    .select()
    .single();

  if (error) {
    console.error("Error updating student:", error);
    throw new Error("Failed to update student");
  }

  return data;
}


/**
 * Delete a single student using the client-side Supabase client.
 */
export async function deleteStudent(schoolId: string, studentId: string) {
  const supabase = createClientInClient();

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId)
    .eq("school_id", schoolId);

  if (error) {
    console.error("Error deleting student:", error);
    throw new Error("Failed to delete student.");
  }

  return { success: true };
}


/**
 * Delete multiple students using the client-side Supabase client.
 */
export async function deleteStudentsBulk(schoolId: string, studentIds: string[]) {
  const supabase = createClientInClient();

  const { error } = await supabase
    .from("students")
    .delete()
    .in("id", studentIds)
    .eq("school_id", schoolId);

  if (error) {
    console.error("Error deleting students in bulk:", error);
    throw new Error("Failed to delete students in bulk.");
  }

  return { success: true };
}

/**
 * Delete students by level using the client-side Supabase client.
 */
export async function deleteStudentsByLevel(schoolId: string, levelId: number) {
  const supabase = createClientInClient();

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("school_id", schoolId)
    .eq("level_id", levelId);

  if (error) {
    console.error("Error deleting students by level:", error);
    throw new Error("Failed to delete students by level.");
  }

  return { success: true };
}
