import { SupabaseClient } from "@supabase/supabase-js";

const isOwnerOfProject = async (client: SupabaseClient, projectId: number, userId: string) => {
  try {
    const { data, error } = await client.from("project").select("...business(user_id)").eq("id", projectId).single();

    if (error) {
      throw new Error(`Error fetching project: ${error}`);
    }

    if (!data) {
      return false;
    }

    return data.user_id === userId;
  } catch (error) {
    return false;
  }
};

export { isOwnerOfProject };
