"use client";

import { SchoolProvider } from "@/context/SchoolContext";
import { Sidebar } from "@/components/sidebar";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

interface ClientAdminLayoutProps {
  user: User;
  schoolId: string | null;
  children: ReactNode;
}

export default function ClientAdminLayout({ user, schoolId, children }: ClientAdminLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <SchoolProvider userId={user.id} schoolId={schoolId}>
      <div className={`flex h-screen overflow-hidden ${resolvedTheme === "light" ? "light" : ""}`}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background text-foreground p-6">
            {children}
          </main>
        </div>
      </div>
    </SchoolProvider>
  );
}
