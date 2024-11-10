import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

export function getProjectLogByProjectId(client: SupabaseClient<Database>, projectId: number) {
  return client
    .from("project_log")
    .select(
      `
        id,
        operation_type,
        record_id,
        old_data,
        new_data,
        changed_at,
        table_name
        `
    )
    .eq("record_id", projectId);
}
