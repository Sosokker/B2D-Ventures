import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";

export async function getCurrentUserID() {
  const supabase = createSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Error fetching user:', error);
    return;
  }

  return user.id;
}