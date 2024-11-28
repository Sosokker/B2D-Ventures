import { SupabaseClient } from "@supabase/supabase-js";

export function getFollow(client: SupabaseClient, user_id: string, project_id: number) {
  return client
    .from("follow")
    .select("id, project_id, user_id, created_at")
    .eq("user_id", user_id)
    .eq("project_id", project_id)
    .maybeSingle();
}

export function getFollowByUserId(client: SupabaseClient, user_id: string) {
  return client.from("follow").select("id, project_id, user_id, created_at").eq("user_id", user_id);
}

export async function insertFollow(client: SupabaseClient, user_id: string, project_id: number) {
  const { error } = await client.from("follow").insert({ user_id, project_id }).select();

  if (error) {
    return error;
  }

  return null;
}

export async function deleteFollow(client: SupabaseClient, user_id: string, project_id: number) {
  const { error } = await client.from("follow").delete().eq("user_id", user_id).eq("project_id", project_id);

  if (error) {
    return error;
  }
  return null;
}
