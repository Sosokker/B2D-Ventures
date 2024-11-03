import { SupabaseClient } from "@supabase/supabase-js";

export const requestAccessToDataRoom = (client: SupabaseClient, dataRoomId: number, userId: number) => {
  return client.from("access_request").insert([
    {
      dataroom_id: dataRoomId,
      user_id: userId,
      status: "pending",
    },
  ]);
};

export const updateAccessRequestStatus = (
  client: SupabaseClient,
  requestId: number,
  status: "approve" | "reject" | "pending"
) => {
  return client.from("access_request").update({ status: status }).eq("id", requestId);
};
