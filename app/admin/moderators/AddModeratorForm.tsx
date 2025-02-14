"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { handleAddModerator } from "./actions";

interface AddModeratorFormProps {
  onSuccess: () => Promise<void>;
  schoolId: string | null;
}

export default function AddModeratorForm({ onSuccess, schoolId }: AddModeratorFormProps) {
  const [formData, setFormData] = useState({
    givenName: "",
    fathersName: "",
    mothersName: "",
    identity: "",
  });

  const { toast } = useToast();

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
      await handleAddModerator({
        schoolId,
        moderator: {
          given_name: formData.givenName,
          fathers_name: formData.fathersName || null,
          mothers_name: formData.mothersName || null,
          identity: formData.identity,
        },
      });
      
      toast({
        title: "Éxito",
        description: "Moderador agregado con éxito.",
      });

      setFormData({ givenName: "", fathersName: "", mothersName: "", identity: "" });
      await onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar al moderador.",
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
      <Button type="submit">Agregar Moderador</Button>
    </form>
  );
}
