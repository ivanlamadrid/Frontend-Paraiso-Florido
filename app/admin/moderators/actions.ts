"use server";

import { revalidatePath } from "next/cache";
import { createModerator, updateModerator, deleteModerator } from "@/app/utils/supabase/moderators";

interface AddModeratorParams {
  schoolId: string;
  moderator: {
    given_name: string;
    fathers_name: string | null;
    mothers_name: string | null;
    identity: string;
  };
}

interface UpdateModeratorParams {
  moderatorId: string;
  updatedData: {
    given_name: string;
    fathers_name: string | null;
    mothers_name: string | null;
    identity: string;
  };
}

interface DeleteModeratorParams {
  moderatorId: string;
}

export async function handleAddModerator({ schoolId, moderator }: AddModeratorParams) {
  await createModerator({
    school_id: schoolId,
    ...moderator,
  });
  revalidatePath("/admin/moderators");
}

export async function handleUpdateModerator({ moderatorId, updatedData }: UpdateModeratorParams) {
  await updateModerator(moderatorId, updatedData);
  revalidatePath("/admin/moderators");
}

export async function handleDeleteModerator({ moderatorId }: DeleteModeratorParams) {
  await deleteModerator(moderatorId);
  revalidatePath("/admin/moderators");
}
