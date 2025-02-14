"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AttendanceRecord {
  date: string
  check_in: string
}

interface DashboardContentProps {
  attendanceData: AttendanceRecord[]
  totalStudents: number
}

export default function DashboardContent({ attendanceData, totalStudents }: DashboardContentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [attendanceDates, setAttendanceDates] = useState<Date[]>([])

  useEffect(() => {
    const dates = attendanceData.map((record) => new Date(record.date))
    setAttendanceDates(dates)
  }, [attendanceData])

  const todayAttendance = attendanceData.filter(
    (record) => new Date(record.date).toDateString() === new Date().toDateString(),
  ).length

  const weeklyAttendanceData = attendanceData.reduce(
    (acc, record) => {
      const date = new Date(record.date)
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" })
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(weeklyAttendanceData).map(([day, attendance]) => ({
    day,
    attendance,
  }))

  const averageWeeklyAttendance = Object.values(weeklyAttendanceData).reduce((sum, count) => sum + count, 0) / 7

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asistencia de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((todayAttendance / totalStudents) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {todayAttendance} de {totalStudents} estudiantes presentes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((averageWeeklyAttendance / totalStudents) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{averageWeeklyAttendance.toFixed(0)} estudiantes en promedio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Estudiantes matriculados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausencias Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents - todayAttendance}</div>
            <p className="text-xs text-muted-foreground">Estudiantes ausentes hoy</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen Semanal de Asistencia</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Calendario de Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                attendance: attendanceDates,
              }}
              modifiersStyles={{
                attendance: { backgroundColor: "#8884d8", color: "white" },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
  }

