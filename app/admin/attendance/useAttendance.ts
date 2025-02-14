import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useSchoolId } from "@/context/SchoolContext";

interface Attendance {
  id: string;
  date: string;
  student_name: string;
  check_in: string;
  check_out: string;
}

export function useAttendance() {
  const schoolId = useSchoolId();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchAttendances = async () => {
      if (!schoolId) return;

      try {
        const { data, error } = await supabase
          .from("attendance")
          .select(`
            id,
            date,
            check_in,
            check_out,
            students (given_name, fathers_name, mothers_name, school_id)
          `)
          .eq("students.school_id", schoolId)
          .order("date", { ascending: false });

        if (error) throw error;

        const formattedData = data.map((item) => {
          // Handle the case where students is an array
          const student = Array.isArray(item.students) ? item.students[0] : item.students;
          const studentName = student ? `${student.given_name} ${student.fathers_name} ${student.mothers_name}` : "Unknown Student";

          return {
            id: item.id,
            date: new Date(item.date).toISOString().split("T")[0],
            student_name: studentName,
            check_in: item.check_in ? new Date(item.check_in).toLocaleTimeString() : "N/A",
            check_out: item.check_out ? new Date(item.check_out).toLocaleTimeString() : "N/A",
          };
        });

        setAttendances(formattedData);
      } catch (error) {
        setError(error instanceof Error ? error : new Error("An unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendances();
  }, [supabase, schoolId]);

  return { attendances, isLoading, error };
}
