import { Suspense } from "react";
import AttendanceTable from "./AttendanceTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Registros de Asistencia</h1>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Cargando datos de asistencia...</div>}>
            <AttendanceTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
  }
