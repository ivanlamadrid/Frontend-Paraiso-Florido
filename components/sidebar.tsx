"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, Users, UserCog, School, CreditCard, ChevronLeft, ChevronRight, Key, Calendar, BarChart } from "lucide-react";

const sidebarItems = [
  { name: "Panel de control", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Estudiantes", href: "/admin/students", icon: Users },
  { name: "Moderadores", href: "/admin/moderators", icon: UserCog },
  { name: "Escuela", href: "/admin/school", icon: School },
  { name: "Diseño de tarjeta", href: "/admin/card-design", icon: CreditCard },
  { name: "Analíticas", href: "/admin/analytics", icon: BarChart },
  { name: "Credenciales", href: "/admin/credentials", icon: Key },
  { name: "Asistencia", href: "/admin/attendance", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn("relative flex flex-col bg-white border-r transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!isCollapsed && <h2 className="text-lg font-semibold">Paraíso Florido 3082</h2>}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-1 px-2 py-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("h-6 w-6", isCollapsed ? "mr-0" : "mr-3")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
