import { SupabaseClient } from "@supabase/supabase-js";

interface NotificationData {
  count: number;
  status: number;
  statusText: string;
}

export async function getUnreadNotificationCountByUserId(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("notification")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", userId)
    .eq("is_read", false);

  if (error) {
    return { data: null, error: error };
  }

  if (data === null) {
    return { data: null, error: error };
  } else {
    const notiData = data as unknown as NotificationData;
    return { data: notiData, error: error };
  }
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
    .eq("receiver_id", userId);
}
