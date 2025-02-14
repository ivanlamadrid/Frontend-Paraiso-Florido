"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useCredentials } from "./useCredentials";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSchoolId } from "@/context/SchoolContext"; // Using school context

type FilterType = "all" | "student" | "moderator";

export default function CredentialsPageClient() {
  const schoolId = useSchoolId();
  const { credentials, isLoading, error, mutate } = useCredentials(schoolId);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");
  const itemsPerPage = 10;

  const filteredCredentials = useMemo(() => {
    return (
      credentials?.filter((credential) => {
        const matchesSearch = Object.values(credential).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesFilter = filter === "all" || credential.entity_type === filter;
        return matchesSearch && matchesFilter;
      }) || []
    );
  }, [credentials, searchTerm, filter]);

  const paginatedCredentials = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCredentials.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCredentials, currentPage]);

  const totalPages = Math.ceil(filteredCredentials.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar credenciales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {filter === "all" ? "Todos" : filter === "student" ? "Estudiantes" : "Moderadores"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter("all")}>Todos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("student")}>Estudiantes</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("moderator")}>Moderadores</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  
      {isLoading ? (
        <p>Cargando credenciales...</p>
      ) : error ? (
        <p>Error al cargar las credenciales: {error.message}</p>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Tipo de entidad</TableHead>
                  <TableHead>Código QR</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCredentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell>{credential.username}</TableCell>
                    <TableCell>{credential.entity_type}</TableCell>
                    <TableCell>
                      <QRCode value={credential.username} size={64} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
  
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="text-sm font-medium">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
 }
