"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SchoolContext = createContext<string | null>(null);

export function SchoolProvider({
  userId,
  schoolId,
  children,
}: {
  userId: string;
  schoolId: string | null;
  children: React.ReactNode;
}) {
  const [currentSchoolId, setCurrentSchoolId] = useState<string | null>(schoolId);

  useEffect(() => {
    setCurrentSchoolId(schoolId);
  }, [schoolId]);

  return <SchoolContext.Provider value={currentSchoolId}>{children}</SchoolContext.Provider>;
}

export function useSchoolId() {
  return useContext(SchoolContext);
}
