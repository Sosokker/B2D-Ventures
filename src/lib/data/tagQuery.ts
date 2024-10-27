import { SupabaseClient } from "@supabase/supabase-js";

export const getTagsByProjectIds = (client: SupabaseClient, projectIds: string[]) => {
  return client.from("project_tag").select(`item_id, ...tag (tag_value:value)`).in("item_id", projectIds);
};
