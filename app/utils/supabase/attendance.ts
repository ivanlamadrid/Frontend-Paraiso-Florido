import { createClient } from "@/app/utils/supabase/server";
import getSchoolIdForUser from "./schools";

/**
 * Registrar la asistencia (check-in) de un estudiante.
 */
export async function checkInStudent(userId: string, studentId: string, checkTimeId: string) {
  const schoolId = await getSchoolIdForUser(userId);
  const supabase = await createClient();

  // Verificar si el estudiante pertenece a la escuela del usuario
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("id", studentId)
    .eq("school_id", schoolId)
    .single();

  if (studentError || !student) {
    console.error("Error checking student eligibility for check-in:", studentError);
    throw new Error("Student does not belong to your school or does not exist.");
  }

  // Registrar la entrada
  const { error: attendanceError } = await supabase.from("attendance").insert({
    student_id: studentId,
    school_id: schoolId,
    check_time_id: checkTimeId,
    status: "check-in",
    timestamp: new Date().toISOString(),
  });

  if (attendanceError) {
    console.error("Error during check-in:", attendanceError);
    throw new Error("Failed to record check-in.");
  }

  return { success: true, message: "Check-in recorded successfully." };
}

/**
 * Registrar la salida (check-out) de un estudiante.
 */
export async function checkOutStudent(userId: string, studentId: string, checkTimeId: string) {
  const schoolId = await getSchoolIdForUser(userId);
  const supabase = await createClient();

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("id", studentId)
    .eq("school_id", schoolId)
    .single();

  if (studentError || !student) {
    console.error("Error checking student eligibility for check-out:", studentError);
    throw new Error("Student does not belong to your school or does not exist.");
  }

  const { error: attendanceError } = await supabase.from("attendance").insert({
    student_id: studentId,
    school_id: schoolId,
    check_time_id: checkTimeId,
    status: "check-out",
    timestamp: new Date().toISOString(),
  });

  if (attendanceError) {
    console.error("Error during check-out:", attendanceError);
    throw new Error("Failed to record check-out.");
  }

  return { success: true, message: "Check-out recorded successfully." };
}

/**
 * Obtener el historial de asistencia de un estudiante.
 */
export async function getAttendanceHistory(userId: string, studentId: string) {
  const schoolId = await getSchoolIdForUser(userId);
  const supabase = await createClient();

  const { data: attendance, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", studentId)
    .eq("school_id", schoolId)
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Error fetching attendance history:", error);
    throw new Error("Failed to fetch attendance history.");
  }

  return attendance;
}
