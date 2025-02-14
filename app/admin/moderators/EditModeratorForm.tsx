"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { handleUpdateModerator } from "./actions";
import type { Moderator } from "@/app/types/moderator";
import { useSchoolId } from "@/context/SchoolContext";

interface EditModeratorFormProps {
  moderator: Moderator;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditModeratorForm({ moderator, onClose, onSuccess }: EditModeratorFormProps) {
  const [formData, setFormData] = useState({
    givenName: moderator.given_name,
    fathersName: moderator.fathers_name || "",
    mothersName: moderator.mothers_name || "",
    identity: moderator.identity,
  });

  const { toast } = useToast();
  const schoolId = useSchoolId();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!schoolId) {
      toast({
        title: "Error",
        description: "Falta el ID de la escuela.",
        variant: "destructive",
      });
      return;
    }

    try {
      await handleUpdateModerator({
        moderatorId: moderator.id || "",
        updatedData: {
          given_name: formData.givenName,
          fathers_name: formData.fathersName || null,
          mothers_name: formData.mothersName || null,
          identity: formData.identity,
        },
      });
      
      toast({
        title: "Éxito",
        description: "Moderador actualizado con éxito.",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el moderador.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="givenName">Nombres</Label>
        <Input id="givenName" name="givenName" value={formData.givenName} onChange={handleInputChange} required />
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
      <Button type="submit">Actualizar Moderador</Button>
    </form>
  );
}
