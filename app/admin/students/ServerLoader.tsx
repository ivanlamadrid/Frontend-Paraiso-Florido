import { getStudentsForCurrentUser } from "@/app/utils/supabase/students";
import { getLevels } from "@/app/utils/supabase/levels";
import { createClient } from "@/app/utils/supabase/server";
import getSchoolIdForUser from "@/app/utils/supabase/schools";

// Deep clean function to remove any non-serializable properties
function deepClean<T>(input: T): T {
  return JSON.parse(JSON.stringify(input));
}

export default async function ServerLoader(userId: string) {
  const supabase = await createClient();

  // Get the school ID associated with the user
  const schoolId = await getSchoolIdForUser(userId);

  // Fetch students and static levels
  const students = await getStudentsForCurrentUser(userId);
  const levels = await getLevels();

  // Fetch check-in/check-out times and pass only the raw data
  const { data: checkTimesData, error: checkTimesError } = await supabase
    .from("check_time")
    .select("id, name, check_in_start, check_in_end, check_out_start, check_out_end, school_id");

  if (checkTimesError) {
    throw new Error("Failed to fetch check times.");
  }

  // Return sanitized data
  return {
    students: deepClean(students || []),
    schoolId,
    checkTimes: deepClean(checkTimesData || []),
    levels: deepClean(levels || []),
  };
}
