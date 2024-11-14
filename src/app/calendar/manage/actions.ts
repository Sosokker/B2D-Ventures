import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export default function getMeetingLog(client: SupabaseClient<Database>, projectId: number) {
  return client
    .from("meeting_log")
    .select(
      `
        id,
        meet_date,
        start_time,
        end_time,
        note,
        user_id,
        project_id,
        created_at
        `
    )
    .eq("project_id", projectId);
}
