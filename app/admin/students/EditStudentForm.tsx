"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { handleUpdateStudent } from "./actions"; 
import type { CheckTime, Level, Student } from "@/app/types/student";

interface EditStudentFormProps {
  student: Student | null;
  onClose: () => void;
  onSuccess: () => void;
  schoolId: string;
  levels: Level[];
  checkTimes: CheckTime[];
}

export function EditStudentForm({ student, onClose, onSuccess, schoolId, levels, checkTimes }: EditStudentFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    givenName: student?.given_name || "",
    fathersName: student?.fathers_name || "",
    mothersName: student?.mothers_name || "",
    identity: student?.identity || "",
    levelId: student?.level_id?.toString() || "",
    checkTimeId: student?.check_time_id || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!schoolId || !student) {
      toast({
        title: "Error",
        description: "Falta la ID de la escuela o la información del estudiante.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedData = {
        given_name: formData.givenName,
        fathers_name: formData.fathersName || null,
        mothers_name: formData.mothersName || null,
        identity: formData.identity,
        level_id: formData.levelId ? Number(formData.levelId) : null,
        check_time_id: formData.checkTimeId || null,
      };

      await handleUpdateStudent({
        schoolId,
        studentId: student.id,
        updatedData,
      });

      toast({
        title: "Éxito",
        description: "Estudiante actualizado exitosamente.",
      });

      onSuccess(); 
      onClose(); 
    } catch (error) {
      console.error("Error al actualizar al estudiante:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el estudiante.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="givenName">Nombres</Label>
        <Input
          id="givenName"
          name="givenName"
          value={formData.givenName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="fathersName">Apellido Paterno</Label>
        <Input id="fathersName" name="fathersName" value={formData.fathersName} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="mothersName">Apellido Materno</Label>
        <Input id="mothersName" name="mothersName" value={formData.mothersName} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="identity">Identidad</Label>
        <Input id="identity" name="identity" value={formData.identity} onChange={handleInputChange} required />
      </div>
      <div>
        <Label id="levelId-label">Nivel</Label>
        <Select
          aria-labelledby="levelId-label"
          onValueChange={(value) => handleSelectChange("levelId", value)}
          value={formData.levelId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un nivel" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level.id} value={level.id.toString()}>
                {level.level_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label id="checkTimeId-label">Horario</Label>
        <Select
          aria-labelledby="checkTimeId-label"
          onValueChange={(value) => handleSelectChange("checkTimeId", value)}
          value={formData.checkTimeId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un horario" />
          </SelectTrigger>
          <SelectContent>
            {checkTimes.map((checkTime) => (
              <SelectItem key={checkTime.id} value={checkTime.id}>
                {checkTime.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Actualizar Estudiante</Button>
    </form>
  );
}
