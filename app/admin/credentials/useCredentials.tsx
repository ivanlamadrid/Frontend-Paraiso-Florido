import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/app/utils/supabase/client";

interface Credential {
  id: string;
  username: string;
  entity_type: "student" | "moderator";
}

export function useCredentials(schoolId: string | null) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  // Define the fetch function
  const fetchCredentials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch student credentialss
      const { data: studentCredentials, error: studentError } = await supabase
        .from("student_credentials")
        .select("id, username, student_id");

      if (studentError) throw studentError;

      // Fetch moderator credentials
      const { data: moderatorCredentials, error: moderatorError } = await supabase
        .from("moderator_credentials")
        .select("id, username, moderator_id");

      if (moderatorError) throw moderatorError;

      // Combine and format the credentials
      const formattedCredentials: Credential[] = [
        ...studentCredentials.map((cred): Credential => ({
          id: cred.id,
          username: cred.username,
          entity_type: "student",
        })),
        ...moderatorCredentials.map((cred): Credential => ({
          id: cred.id,
          username: cred.username,
          entity_type: "moderator",
        })),
      ];

      setCredentials(formattedCredentials);
    } catch (err) {
      console.error("Error fetching credentials:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Initial fetch
  useEffect(() => {
    if (schoolId) {
      fetchCredentials();
    }
  }, [schoolId, fetchCredentials]);

  // Expose the fetch function for external use
  return { credentials, isLoading, error, mutate: fetchCredentials };
}
