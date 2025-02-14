"use client";

import { useState } from "react";
import { useAttendance } from "./useAttendance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

export default function AttendanceTable() {
  const { attendances, isLoading, error } = useAttendance();
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  if (isLoading) return <div>Loading attendance data...</div>;
  if (error) return <div>Error loading attendance data: {error.message}</div>;

  const filteredAttendances = attendances.filter((attendance) => {
    const dateMatch = filterDate ? attendance.date.includes(filterDate) : true;
    const statusMatch =
      filterStatus.length > 0 ? filterStatus.includes(attendance.check_out === "N/A" ? "Present" : "Checked Out") : true;
    return dateMatch && statusMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Filtrar por fecha (AAAA-MM-DD)"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" /> Filtrar estado
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {["Presente", "Salida registrada"].map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={filterStatus.includes(status)}
                onCheckedChange={(checked) => {
                  setFilterStatus((prev) => (checked ? [...prev, status] : prev.filter((s) => s !== status)));
                }}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Nombre completo</TableHead>
              <TableHead>Hora de entrada</TableHead>
              <TableHead>Hora de salida</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendances.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell>{attendance.date}</TableCell>
                <TableCell>{attendance.student_name}</TableCell>
                <TableCell>{attendance.check_in}</TableCell>
                <TableCell>{attendance.check_out}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
  }
