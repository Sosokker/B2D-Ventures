import { SupabaseClient } from "@supabase/supabase-js";

export const getTagsByProjectIds = (client: SupabaseClient, projectIds: string[]) => {
  return client.from("project_tag").select(`item_id, ...tag (tag_value:value)`).in("item_id", projectIds);
};

export function getProjectTag(client: SupabaseClient, projectId: number) {
  return client.from("project_tag").select("tag_id").in("item_id", [projectId]);
}

export function getTagName(client: SupabaseClient, tagId: number) {
  return client.from("tag").select("value").in("id", [tagId]);
}
