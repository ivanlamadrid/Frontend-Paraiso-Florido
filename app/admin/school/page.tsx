"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useSchoolId } from "@/context/SchoolContext";
import { createClient } from "@/app/utils/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolData } from "./SchoolData";
import type { School, CheckTime } from "@/app/types/school";

export default function SchoolPage() {
  const schoolId = useSchoolId();
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
  const [checkTimes, setCheckTimes] = useState<CheckTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      router.push("/"); // Redirigir si no hay schoolId
      return;
    }

    const fetchSchoolData = async () => {
      const supabase = createClient();

      try {
        // Obtener información del colegio
        const { data: schoolData, error: schoolError } = await supabase
          .from("schools")
          .select("*")
          .eq("id", schoolId)
          .single();

        if (schoolError) {
          setError("Failed to load school information.");
          console.error(schoolError);
          return;
        }

        setSchool(schoolData);

        // Obtener los horarios
        const { data: timesData, error: timesError } = await supabase
          .from("check_time")
          .select("*")
          .eq("school_id", schoolId);

        if (timesError) {
          setError("Failed to load schedule times.");
          console.error(timesError);
          return;
        }

        setCheckTimes(timesData || []);
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [schoolId, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestión de la escuela</h1>
      {school && <SchoolData school={school} checkTimes={checkTimes} />}
    </div>
  );
}
