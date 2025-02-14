"use client";

import { useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteStudent } from "@/app/utils/supabase/students";
import { useSchoolId } from "@/context/SchoolContext"; 
import { ViewStudentDetails } from "./ViewStudentDetails"; 
import { EditStudentForm } from "./EditStudentForm"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CheckTime, Level, Student } from "@/app/types/student";

interface StudentsTableProps {
  setSelectedStudents: (students: string[]) => void;
  students: Student[];
  refreshStudents: () => void;
  checkTimes: CheckTime[];
  levels: Level[];
}
const ITEMS_PER_PAGE = 10;

const levelMap = {
  1: "Inicial",
  2: "Primaria",
  3: "Secundaria",
};

export function StudentsTable({ setSelectedStudents, students, refreshStudents, checkTimes, levels }: StudentsTableProps) {
  const { toast } = useToast();
  const schoolId = useSchoolId();
  const [sortColumn, setSortColumn] = useState<keyof Student | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudentsState] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSort = useCallback((column: keyof Student) => {
    setSortColumn((prevColumn) => (prevColumn === column ? null : column));
    setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"));
  }, []);

  const sortedStudents = students.sort((a, b) => {
    if (!sortColumn) return 0;
    const valueA = a[sortColumn] !== undefined && a[sortColumn] !== null ? a[sortColumn].toString() : "";
    const valueB = b[sortColumn] !== undefined && b[sortColumn] !== null ? b[sortColumn].toString() : "";
    return valueA.localeCompare(valueB) * (sortDirection === "asc" ? 1 : -1);
  });

  const filteredStudents = sortedStudents.filter((student) =>
    Object.values(student).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedStudents = filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const handleSelectAllStudents = (isChecked: boolean) => {
    const selected = isChecked ? paginatedStudents.map((student) => student.id) : [];
    setSelectedStudentsState(selected);
    setSelectedStudents(selected);
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!schoolId) {
      toast({
        title: "Error",
        description: "No se encontró la ID de la escuela.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteStudent(schoolId, studentId);
      toast({
        title: "Éxito",
        description: "Estudiante eliminado exitosamente.",
      });
      await refreshStudents();  
    } catch (error) {
      console.error("Error al eliminar al estudiante:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar al estudiante.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar estudiantes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedStudents.length === paginatedStudents.length}
                  onCheckedChange={(checked) => handleSelectAllStudents(checked as boolean)}
                />
              </TableHead>
              <TableHead onClick={() => handleSort("given_name")} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  Nombres <ArrowUpDown className="h-4 w-4 ml-2" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("fathers_name")} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  Apellido Paterno <ArrowUpDown className="h-4 w-4 ml-2" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("mothers_name")} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  Apellido Materno <ArrowUpDown className="h-4 w-4 ml-2" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("identity")} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  Identidad <ArrowUpDown className="h-4 w-4 ml-2" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("level_id")} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  Nivel <ArrowUpDown className="h-4 w-4 ml-2" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("check_time_id")} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  Horario <ArrowUpDown className="h-4 w-4 ml-2" />
                </div>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={(checked) => {
                      const newSelection = checked
                        ? [...selectedStudents, student.id]
                        : selectedStudents.filter((id) => id !== student.id);
                      setSelectedStudentsState(newSelection);
                      setSelectedStudents(newSelection);
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{student.given_name}</TableCell>
                <TableCell>{student.fathers_name}</TableCell>
                <TableCell>{student.mothers_name}</TableCell>
                <TableCell>{student.identity}</TableCell>
                <TableCell>{levelMap[student.level_id as keyof typeof levelMap]}</TableCell>
                <TableCell>{student.check_time_id ? checkTimes.find((checkTime) => checkTime.id === student.check_time_id)?.name || "Desconocido" : "No asignado"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(student)}>Ver detalles</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditStudent(student)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteStudent(student.id)}>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <div className="text-sm font-medium">
          Página {currentPage} de {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Diálogo de ver detalles */}
      <ViewStudentDetails 
        student={selectedStudent} 
        isOpen={isViewDialogOpen} 
        onClose={() => setIsViewDialogOpen(false)} 
      />

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Estudiante</DialogTitle>
          </DialogHeader>
          <EditStudentForm
            student={selectedStudent}
            onClose={() => setIsEditDialogOpen(false)}
            onSuccess={refreshStudents}
            schoolId={schoolId!}
            levels={levels}
            checkTimes={checkTimes}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}
