import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import ServerLoader from "./ServerLoader";
import ClientStudentsPage from "./ClientStudentsPage";

export default async function StudentsPage() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    // Llamar al loader para obtener todos los datos necesarios
    const { students, schoolId, checkTimes, levels } = await ServerLoader(user.id);

    return (
      <ClientStudentsPage
        initialStudents={students}
        schoolId={schoolId}
        checkTimes={checkTimes}
        levels={levels}
      />
    );
  } catch (error) {
    console.error("Error loading students page:", error);
    return (
      <div>
        <h1>Error Loading Students</h1>
        <p>{error instanceof Error ? error.message : "An unexpected error occurred."}</p>
      </div>
    );
  }
}
