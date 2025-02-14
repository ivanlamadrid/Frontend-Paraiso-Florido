"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditSchoolInfoForm } from "./EditSchoolInfoForm";
import { EditScheduleForm } from "./EditScheduleForm";
import type { School, CheckTime } from "@/app/types/school";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SchoolDataProps {
  school: School;
  checkTimes: CheckTime[];
}

export function SchoolData({ school, checkTimes }: SchoolDataProps) {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  return (
    <Tabs defaultValue="info" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">Información del Colegio</TabsTrigger>
        <TabsTrigger value="schedule">Configuración de Horario</TabsTrigger>
      </TabsList>

      {/* Información General del Colegio */}
      <TabsContent value="info" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={school.logo_url || "/placeholder.svg"} alt="Logotipo del colegio" />
                <AvatarFallback>{school.school_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{school.school_name}</CardTitle>
                <CardDescription>Información general del colegio</CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditingInfo(!isEditingInfo)}>
              {isEditingInfo ? "Cancelar" : "Editar"}
            </Button>
          </CardHeader>
          <CardContent>
            {isEditingInfo ? (
              <EditSchoolInfoForm school={school} onCancel={() => setIsEditingInfo(false)} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-semibold">Correo electrónico:</p> {school.email}
                </div>
                <div>
                  <p className="font-semibold">Teléfono:</p> {school.phone}
                </div>
                <div>
                  <p className="font-semibold">Dirección:</p> {school.address}
                </div>
                <div>
                  <p className="font-semibold">Sitio web:</p>{" "}
                  <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {school.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Configuración del Horario */}
      <TabsContent value="schedule" className="space-y-4">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Configuración de Horario</CardTitle>
              <CardDescription>Rangos de horarios de entrada y salida</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsEditingSchedule(!isEditingSchedule)}>
              {isEditingSchedule ? "Cancelar" : "Editar"}
            </Button>
          </CardHeader>
          <CardContent>
            {isEditingSchedule ? (
              <EditScheduleForm school={school} checkTimes={checkTimes} onCancel={() => setIsEditingSchedule(false)} />
            ) : (
              <div className="space-y-2">
                {checkTimes.map((checkTime) => (
                  <div key={checkTime.id} className="border p-4 rounded-md">
                    <h3 className="font-semibold">{checkTime.name}</h3>
                    <p>Entrada: {formatTime(checkTime.check_in_start)} - {formatTime(checkTime.check_in_end)}</p>
                    <p>Salida: {formatTime(checkTime.check_out_start)} - {formatTime(checkTime.check_out_end)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function formatTime(time: string): string {
  return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
