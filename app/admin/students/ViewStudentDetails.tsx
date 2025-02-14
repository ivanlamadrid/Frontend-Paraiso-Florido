import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 
import type { Student } from "@/app/types/student";
import { Card, CardContent } from "@/components/ui/card";

interface ViewStudentDetailsProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const levelMap = {
  1: "Inicial",
  2: "Primaria",
  3: "Secundaria",
};

export function ViewStudentDetails({ student, isOpen, onClose }: ViewStudentDetailsProps) {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">  {/* Aumentamos el ancho máximo */}
        <DialogHeader>
          <DialogTitle>Detalles del Estudiante</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Nombres:</span>
              <span className="col-span-3">{student.given_name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Apellido Paterno:</span>
              <span className="col-span-3">{student.fathers_name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Apellido Materno:</span>
              <span className="col-span-3">{student.mothers_name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Identidad:</span>
              <span className="col-span-3">{student.identity}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Nivel:</span>
              <span className="col-span-3">{levelMap[student.level_id as keyof typeof levelMap]}</span>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
