import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export const getFilesByDataroomId = (client: SupabaseClient<Database>, dataroomId: number) => {
  const query = client
    .from("dataroom_material")
    .select(
      `
      id,
      dataroom_id,
      file_url,
      file_type:material_file_type!inner (
        id,
        value
      ),
      uploaded_at
      `
    )
    .eq("dataroom_id", dataroomId);
  return query;
};

export const getDataRoomsByProjectId = (client: SupabaseClient, projectId: number) => {
  return client
    .from("dataroom")
    .select(
      `
        id,
        project_id,
        is_public,
        created_at,
        updated_at,
        dataroom_material (
          id,
          file_url,
          ...file_type_id (
            file_type_id:id,
            file_type_value:value
          ),
          uploaded_at
        )
      `
    )
    .eq("project_id", projectId);
};

export const getAccessRequests = (client: SupabaseClient, filters: { dataroomId?: number; userId?: string }) => {
  let query = client.from("access_request").select(
    `
        id,
        user_id,
        status,
        requested_at
      `
  );

  if (filters.dataroomId !== undefined) {
    query = query.eq("data_room_id", filters.dataroomId);
  }

  if (filters.userId !== undefined) {
    query = query.eq("user_id", filters.userId);
  }

  return query;
};
