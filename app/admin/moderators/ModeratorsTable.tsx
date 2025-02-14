import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ViewModeratorDetails } from "./ViewModeratorDetails";
import { EditModeratorForm } from "./EditModeratorForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Moderator } from "@/app/types/moderator";
import { useToast } from "@/hooks/use-toast";
import { handleDeleteModerator } from "./actions";

interface ModeratorsTableProps {
  moderators: Moderator[];
  refreshModerators: () => void;
}

const ITEMS_PER_PAGE = 10;

export function ModeratorsTable({ moderators, refreshModerators }: ModeratorsTableProps) {
  const [selectedModerator, setSelectedModerator] = useState<Moderator | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof Moderator | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleSort = (column: keyof Moderator) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (moderatorId: string) => {
    try {
      await handleDeleteModerator({ moderatorId });
      toast({
        title: "Success",
        description: "Moderator deleted successfully.",
      });
      await refreshModerators();  // Llamamos a refresh después de la eliminación
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete moderator.",
        variant: "destructive",
      });
    }
  };

  const sortedModerators = [...moderators].sort((a, b) => {
    if (!sortColumn) return 0;
    const valueA = a[sortColumn]?.toString().toLowerCase() || "";
    const valueB = b[sortColumn]?.toString().toLowerCase() || "";
    return valueA.localeCompare(valueB) * (sortDirection === "asc" ? 1 : -1);
  });

  const filteredModerators = sortedModerators.filter((moderator) =>
    Object.values(moderator).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedModerators = filteredModerators.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredModerators.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar moderadores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("given_name")} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  Nombres <ArrowUpDown className="h-4 w-4 ml-2" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("fathers_name")} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  Apellido Paterno <ArrowUpDown className="h-4 w-4 ml-2" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("mothers_name")} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  Apellido Materno <ArrowUpDown className="h-4 w-4 ml-2" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("identity")} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  Identidad <ArrowUpDown className="h-4 w-4 ml-2" />
                </div>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedModerators.map((moderator) => (
              <TableRow key={moderator.id}>
                <TableCell>{moderator.given_name}</TableCell>
                <TableCell>{moderator.fathers_name || "N/A"}</TableCell>
                <TableCell>{moderator.mothers_name || "N/A"}</TableCell>
                <TableCell>{moderator.identity}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedModerator(moderator); setIsViewDialogOpen(true); }}>
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedModerator(moderator); setIsEditDialogOpen(true); }}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(moderator.id!)} className="text-red-600">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      {/* Ver detalles del moderador */}
      {selectedModerator && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Moderador</DialogTitle>
            </DialogHeader>
            <ViewModeratorDetails
              moderator={selectedModerator}
              isOpen={isViewDialogOpen}
              onClose={() => setIsViewDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Editar moderador */}
      {selectedModerator && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Moderador</DialogTitle>
            </DialogHeader>
            <EditModeratorForm
              moderator={selectedModerator}
              onClose={() => setIsEditDialogOpen(false)}
              onSuccess={refreshModerators}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
