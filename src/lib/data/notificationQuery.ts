import { SupabaseClient } from "@supabase/supabase-js";

export async function getUnreadNotificationCountByUserId(client: SupabaseClient, userId: string) {
  const { count, error } = await client
    .from("notification")
    .select("*", { count: "exact" })
    .eq("receiver_id", userId)
    .eq("is_read", false);
  return { count, error };
}

export function getNotificationByUserId(client: SupabaseClient, userId: string | undefined) {
  return client
    .from("notification")
    .select(
      `
        id,
        receiver_id,
        message,
        created_at,
        is_read
        `
    )
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });
}
