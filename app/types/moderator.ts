// @/app/types/moderator.ts
export interface Moderator {
  id?: string;
  given_name: string;
  fathers_name?: string | null;
  mothers_name?: string | null;
  identity: string;
  school_id: string;
  created_at?: string;
}
