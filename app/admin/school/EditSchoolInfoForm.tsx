"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { School } from "@/app/types/school";
import { createClient } from "@/app/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditSchoolInfoFormProps {
  school: School;
  onCancel: () => void;
}

export function EditSchoolInfoForm({ school, onCancel }: EditSchoolInfoFormProps) {
  const [formData, setFormData] = useState(school);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage.from("logos").upload(fileName, file);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar el logotipo. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("logos").getPublicUrl(fileName);

        setFormData((prev) => ({ ...prev, logo_url: publicUrl }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const { error } = await supabase.from("schools").update(formData).eq("id", school.id);

    if (error) {
      console.error("Error al actualizar la información de la escuela:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la información de la escuela. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Éxito",
        description: "La información de la escuela se actualizó correctamente.",
      });
      router.refresh();
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={formData.logo_url || "/placeholder.svg"} alt="Logotipo de la escuela" />
          <AvatarFallback>{formData.school_name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="logo">Logotipo de la escuela</Label>
          <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="school_name">Nombre de la escuela</Label>
          <Input
            id="school_name"
            name="school_name"
            value={formData.school_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_name">Nombre del contacto</Label>
          <Input
            id="contact_name"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Dirección</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="website">Sitio web</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  );
}
