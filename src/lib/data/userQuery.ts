import { SupabaseClient } from "@supabase/supabase-js";

async function getUserProfile(client: SupabaseClient, userId: string) {
  try {
    const { data, error } = await client
      .from("profiles")
      .select("updated_at, username, full_name, avatar_url, website, bio")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: "An unexpected error occurred." };
  }
}

export { getUserProfile };
