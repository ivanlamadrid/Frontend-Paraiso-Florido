import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Moderator } from "@/app/types/moderator";

interface ViewModeratorDetailsProps {
  moderator: Moderator | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewModeratorDetails({ moderator, isOpen, onClose }: ViewModeratorDetailsProps) {
  if (!moderator) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Detalles del Moderador</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Nombres:</span>
              <span className="col-span-3">{moderator.given_name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Apellido Paterno:</span>
              <span className="col-span-3">{moderator.fathers_name || "N/A"}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Apellido Materno:</span>
              <span className="col-span-3">{moderator.mothers_name || "N/A"}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Identidad:</span>
              <span className="col-span-3">{moderator.identity}</span>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
