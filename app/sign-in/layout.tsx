import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sign In - Next.js App",
  description: "User authentication layout",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        {children}
      </body>
    </html>
  );
}
