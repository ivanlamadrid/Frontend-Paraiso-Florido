import { Inter } from "next/font/google";
import "./globals.css";
import ThemedLayout from "./ThemedLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next.js App - Public Layout",
  description: "Landing page and public sections",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemedLayout>{children}</ThemedLayout>
      </body>
    </html>
  );
}
