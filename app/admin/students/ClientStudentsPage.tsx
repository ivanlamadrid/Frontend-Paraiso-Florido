"use client";

import { useState, useEffect, useCallback } from "react";
import { StudentsTable } from "./StudentsTable";
import AddStudentForm from "./AddStudentForm";
import { Toaster } from "@/components/ui/toaster";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { fetchStudentsInClient, createStudentInClient, deleteStudentsBulk, deleteStudentsByLevel } from "@/app/utils/supabase/students";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Student, CheckTime, Level } from "@/app/types/student";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ClientStudentsPageProps {
  initialStudents: Student[];
  schoolId: string | null;
  checkTimes: CheckTime[];
  levels: Level[];
}

export default function ClientStudentsPage({
  initialStudents,
  schoolId,
  checkTimes,
  levels,
}: ClientStudentsPageProps) {
  const [students, setStudents] = useState(initialStudents);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [isDeleteBulkDialogOpen, setIsDeleteBulkDialogOpen] = useState(false);
  const [isDeleteLevelDialogOpen, setIsDeleteLevelDialogOpen] = useState(false);
  const { toast } = useToast();

  const refreshStudents = useCallback(async () => {
    if (!schoolId) return;
    try {
      const refreshedStudents = await fetchStudentsInClient(schoolId);
      setStudents(refreshedStudents);
      toast({
        title: "Éxito",
        description: "La lista de estudiantes ha sido actualizada.",
      });
    } catch (error) {
      console.error("Error al actualizar la lista de estudiantes:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la lista de estudiantes.",
        variant: "destructive",
      });
    }
  }, [schoolId, toast]);

  const handleDeleteBulk = useCallback(async () => {
    if (!schoolId) return;
    try {
      await deleteStudentsBulk(schoolId, selectedStudents);
      toast({
        title: "Éxito",
        description: "Los estudiantes seleccionados han sido eliminados.",
      });
      refreshStudents();
      setIsDeleteBulkDialogOpen(false);
    } catch (error) {
      console.error("Error al eliminar estudiantes seleccionados:", error);
      toast({
        title: "Error",
        description: "No se pudieron eliminar los estudiantes seleccionados.",
        variant: "destructive",
      });
    }
  }, [schoolId, selectedStudents, refreshStudents, toast]);

  const handleDeleteByLevel = useCallback(async () => {
    if (!selectedLevel || !schoolId) return;
    try {
      await deleteStudentsByLevel(schoolId, Number.parseInt(selectedLevel));
      toast({
        title: "Éxito",
        description: "Los estudiantes del nivel seleccionado han sido eliminados.",
      });
      refreshStudents();
      setIsDeleteLevelDialogOpen(false);
      setSelectedLevel("");
    } catch (error) {
      console.error("Error al eliminar estudiantes por nivel:", error);
      toast({
        title: "Error",
        description: "No se pudieron eliminar los estudiantes del nivel seleccionado.",
        variant: "destructive",
      });
    }
  }, [selectedLevel, schoolId, refreshStudents, toast]);

  console.log("Props passed to ClientStudentsPage:", {
    initialStudents,
    checkTimes,
    levels,
  });
  useEffect(() => {
    console.log("Assigned students in state:", students);
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Estudiantes</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsAddStudentDialogOpen(true)}>Agregar estudiante</Button>
          <Button variant="outline" onClick={() => setIsDeleteBulkDialogOpen(true)}>
            Eliminar seleccionados
          </Button>
          <Button variant="outline" onClick={() => setIsDeleteLevelDialogOpen(true)}>
            Eliminar por nivel
          </Button>
        </div>
      </div>

      <StudentsTable setSelectedStudents={setSelectedStudents} students={students} refreshStudents={refreshStudents} levels={levels} checkTimes={checkTimes}/>

      <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nuevo estudiante</DialogTitle>
            <DialogDescription>Ingresa los datos del nuevo estudiante a continuación.</DialogDescription>
          </DialogHeader>
          <AddStudentForm onSuccess={async () => {
            await refreshStudents();
            setIsAddStudentDialogOpen(false);
          }}
          checkTimes={checkTimes}
          levels={levels}
          schoolId={schoolId!}
          />
        </DialogContent>
      </Dialog>

      <Toaster />

      <ConfirmationDialog
        isOpen={isDeleteBulkDialogOpen}
        onClose={() => setIsDeleteBulkDialogOpen(false)}
        onConfirm={handleDeleteBulk}
        title="Eliminar estudiantes seleccionados"
        description="¿Estás seguro de que deseas eliminar todos los estudiantes seleccionados? Esta acción no se puede deshacer."
      />

      <ConfirmationDialog
        isOpen={isDeleteLevelDialogOpen}
        onClose={() => setIsDeleteLevelDialogOpen(false)}
        onConfirm={handleDeleteByLevel}
        title="Eliminar estudiantes por nivel"
        description="¿Estás seguro de que deseas eliminar todos los estudiantes del nivel seleccionado? Esta acción no se puede deshacer."
      />
    </div>
  );
}
