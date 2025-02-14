"use client"; // Client-only component for dynamic theming

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

export default function ThemedLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      {mounted && <div>{children}</div>}
    </ThemeProvider>
  );
}
