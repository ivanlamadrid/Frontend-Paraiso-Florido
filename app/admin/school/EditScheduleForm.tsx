"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { School, CheckTime } from "@/app/types/school";
import { createClient } from "@/app/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TimeRangePicker } from "./TimeRangePicker";
import { PlusCircle, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import type React from "react";

interface EditScheduleFormProps {
  school: School;
  checkTimes: CheckTime[];
  onCancel: () => void;
}

const convertToTimestamptz = (timeString: string | undefined): string | null => {
  if (!timeString || timeString.trim() === "") return null;
  const [hours, minutes] = timeString.split(":");
  if (!hours || !minutes) return null;
  const date = new Date();
  date.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0, 0);
  return date.toISOString();
};

export function EditScheduleForm({ school, checkTimes, onCancel }: EditScheduleFormProps) {
  const [formData, setFormData] = useState<CheckTime[]>(checkTimes.map((ct) => ({
    ...ct,
    name: ct.name || "",
    check_in_start: ct.check_in_start
      ? new Date(ct.check_in_start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      : "",
    check_in_end: ct.check_in_end
      ? new Date(ct.check_in_end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      : "",
    check_out_start: ct.check_out_start
      ? new Date(ct.check_out_start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      : "",
    check_out_end: ct.check_out_end
      ? new Date(ct.check_out_end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      : "",
  })));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleAddCheckTime = () => {
    setFormData([...formData, {
      id: "",
      created_at: "",
      name: "",
      check_in_start: "",
      check_in_end: "",
      check_out_start: "",
      check_out_end: "",
      school_id: school.id,
    }]);
  };

  const handleRemoveCheckTime = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: keyof CheckTime, value: string) => {
    const updatedFormData = [...formData];
    updatedFormData[index] = { ...updatedFormData[index], [field]: value };
    setFormData(updatedFormData);

    if (errors[`${index}-${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${index}-${field}`];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    formData.forEach((checkTime, index) => {
      if (!checkTime.name.trim()) {
        newErrors[`${index}-name`] = "El nombre del turno es obligatorio";
        isValid = false;
      }

      const hasCheckIn = checkTime.check_in_start || checkTime.check_in_end;
      const hasCheckOut = checkTime.check_out_start || checkTime.check_out_end;

      if (hasCheckIn && (!checkTime.check_in_start || !checkTime.check_in_end)) {
        newErrors[`${index}-check_in`] = "Se requieren ambos horarios de entrada";
        isValid = false;
      }

      if (hasCheckOut && (!checkTime.check_out_start || !checkTime.check_out_end)) {
        newErrors[`${index}-check_out`] = "Se requieren ambos horarios de salida";
        isValid = false;
      }

      if (!hasCheckIn && !hasCheckOut) {
        newErrors[`${index}-times`] = "Es obligatorio al menos un rango de entrada o salida";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Corrige los errores en el formulario.",
        variant: "destructive",
      });
      return;
    }

    const supabase = createClient();

    try {
      const upsertPromises = formData.map(async (ct) => {
        const convertedData = {
          name: ct.name,
          school_id: school.id,
          check_in_start: convertToTimestamptz(ct.check_in_start),
          check_in_end: convertToTimestamptz(ct.check_in_end),
          check_out_start: convertToTimestamptz(ct.check_out_start),
          check_out_end: convertToTimestamptz(ct.check_out_end),
        };

        Object.keys(convertedData).forEach((key) => {
          if (convertedData[key as keyof typeof convertedData] === null) {
            delete convertedData[key as keyof typeof convertedData];
          }
        });

        if (ct.id) {
          return supabase.from("check_time").update(convertedData).eq("id", ct.id);
        } else {
          return supabase.from("check_time").insert(convertedData);
        }
      });

      await Promise.all(upsertPromises);

      toast({
        title: "Éxito",
        description: "Los horarios se han actualizado correctamente.",
      });

      const { data: updatedCheckTimes, error: fetchError } = await supabase
        .from("check_time")
        .select("*")
        .eq("school_id", school.id);

      if (fetchError) throw fetchError;

      setFormData(updatedCheckTimes || []);
      router.refresh();
    } catch (error) {
      console.error("Error al actualizar los horarios:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar los horarios. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formData.map((checkTime, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-md">
          <div className="flex justify-between items-center">
            <div className="flex-grow mr-2">
              <Label htmlFor={`shift_name_${index}`}>Nombre del turno</Label>
              <Input
                id={`shift_name_${index}`}
                placeholder="Nombre del turno"
                value={checkTime.name}
                onChange={(e) => handleInputChange(index, "name", e.target.value)}
                className={errors[`${index}-name`] ? "border-red-500" : ""}
              />
              {errors[`${index}-name`] && <p className="text-red-500 text-sm mt-1">{errors[`${index}-name`]}</p>}
            </div>
            <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveCheckTime(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TimeRangePicker
              startLabel="Inicio de entrada"
              endLabel="Fin de entrada"
              startName={`check_in_start_${index}`}
              endName={`check_in_end_${index}`}
              startValue={checkTime.check_in_start || ""}
              endValue={checkTime.check_in_end || ""}
              onChange={(name, value) =>
                handleInputChange(index, name.includes("start") ? "check_in_start" : "check_in_end", value)
              }
            />
            <TimeRangePicker
              startLabel="Inicio de salida"
              endLabel="Fin de salida"
              startName={`check_out_start_${index}`}
              endName={`check_out_end_${index}`}
              startValue={checkTime.check_out_start || ""}
              endValue={checkTime.check_out_end || ""}
              onChange={(name, value) =>
                handleInputChange(index, name.includes("start") ? "check_out_start" : "check_out_end", value)
              }
            />
          </div>

          {errors[`${index}-check_in`] && <p className="text-red-500 text-sm mt-1">{errors[`${index}-check_in`]}</p>}
          {errors[`${index}-check_out`] && <p className="text-red-500 text-sm mt-1">{errors[`${index}-check_out`]}</p>}
        </div>
      ))}

      <Button type="button" variant="outline" onClick={handleAddCheckTime} className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Agregar nuevo turno
      </Button>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  );
}
