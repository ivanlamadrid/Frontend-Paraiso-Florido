// app/admin/students/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { addStudent } from "@/app/utils/supabase/addStudent";
import { updateStudentForCurrentUser } from "@/app/utils/supabase/students";

type AddStudentParams = {
  schoolId: string;
  student: {
    given_name: string;
    fathers_name: string | null;
    mothers_name: string | null;
    identity: string | null;
    level_id: number | null;
    check_time_id: string | null;
  };
};

type UpdateStudentParams = {
    schoolId: string;
    studentId: string;
    updatedData: {
      given_name: string;
      fathers_name: string | null;
      mothers_name: string | null;
      identity: string | null;
      level_id: number | null;
      check_time_id: string | null;
    };
  };
  

export async function handleAddStudent({ schoolId, student }: AddStudentParams) {
  await addStudent(schoolId, student);

  // Revalidamos el path donde se listan los estudiantes
  revalidatePath("/admin/students");
}

export async function handleUpdateStudent({ schoolId, studentId, updatedData }: UpdateStudentParams) {
    await updateStudentForCurrentUser(schoolId, studentId, updatedData);
  
    // Revalidamos el path donde se listan los estudiantes
    revalidatePath("/admin/students");
  }
  