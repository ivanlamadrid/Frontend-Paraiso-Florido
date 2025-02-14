"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeratorsTable } from "./ModeratorsTable";
import { useToast } from "@/hooks/use-toast";
import { fetchModerators, Moderator } from "@/app/utils/supabase/moderators";
import AddModeratorForm from "./AddModeratorForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ModeratorsPageClientProps {
    initialModerators: Moderator[];
    schoolId: string | null;
}

export default function ModeratorsPageClient({ initialModerators, schoolId }: ModeratorsPageClientProps) {
    const [moderators, setModerators] = useState(initialModerators);
    const [isAddModeratorDialogOpen, setIsAddModeratorDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        console.log("Moderadores iniciales:", initialModerators);
        console.log("Prototipos:", initialModerators.map((m) => Object.getPrototypeOf(m)));
    }, [initialModerators]);

    const refreshModerators = useCallback(async () => {
        if (!schoolId) return;
        try {
            const updatedModerators = await fetchModerators(schoolId);
            setModerators(updatedModerators);
            toast({
                title: "Éxito",
                description: "La lista de moderadores se ha actualizado.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar la lista de moderadores.",
                variant: "destructive",
            });
        }
    }, [toast, schoolId]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Moderadores</h1>
                <Button onClick={() => setIsAddModeratorDialogOpen(true)}>Agregar Moderador</Button>
            </div>

            <ModeratorsTable moderators={moderators} refreshModerators={refreshModerators} />

            <Dialog open={isAddModeratorDialogOpen} onOpenChange={setIsAddModeratorDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Moderador</DialogTitle>
                    </DialogHeader>
                    <AddModeratorForm
                        schoolId={schoolId}
                        onSuccess={async () => {
                            await refreshModerators();
                            setIsAddModeratorDialogOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
