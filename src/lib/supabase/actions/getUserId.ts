import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";

export async function getUserId() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  return data.user.id;
}
