"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { handleAddStudent } from "./actions";  // Importamos la acción del servidor
import type { CheckTime, Level } from "@/app/types/student";

interface AddStudentFormProps {
  onSuccess: () => Promise<void>;
  checkTimes: CheckTime[];
  levels: Level[];
  schoolId: string | null;
}

export default function AddStudentForm({ onSuccess, checkTimes, levels, schoolId }: AddStudentFormProps) {
  const [formData, setFormData] = useState({
    givenName: "",
    fathersName: "",
    mothersName: "",
    identity: "",
    levelId: "",
    checkTimeId: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!schoolId) {
        throw new Error("El ID de la escuela es necesario para agregar un estudiante.");
      }

      const cleanFormData = {
        given_name: formData.givenName,
        fathers_name: formData.fathersName || null,
        mothers_name: formData.mothersName || null,
        identity: formData.identity,
        level_id: Number(formData.levelId),
        check_time_id: formData.checkTimeId || null,
      };

      await handleAddStudent({
        schoolId,
        student: cleanFormData,
      });

      toast({
        title: "Éxito",
        description: "Estudiante agregado exitosamente.",
      });

      setFormData({
        givenName: "",
        fathersName: "",
        mothersName: "",
        identity: "",
        levelId: "",
        checkTimeId: "",
      });

      await onSuccess();  // Refrescamos la lista de estudiantes
    } catch (error) {
      console.error("Error al agregar estudiante:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error desconocido.",
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
        <Label htmlFor="fathersName">Apellido paterno</Label>
        <Input id="fathersName" name="fathersName" value={formData.fathersName} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="mothersName">Apellido materno</Label>
        <Input id="mothersName" name="mothersName" value={formData.mothersName} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="identity">Identificación</Label>
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
      <Button type="submit">Agregar estudiante</Button>
    </form>
  );
}
