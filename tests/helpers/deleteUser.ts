import { createClient } from "@supabase/supabase-js";

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabase_url) {
  throw "Supabase Url is undefine";
}

if (!supabase_anon_key) {
  throw "Supabase Anon Key is undefine";
}

const supabase = createClient(supabase_url, supabase_anon_key);

export async function deleteUser(userId: string) {
  try {
    const { data, error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
    console.log(`User ${userId} deleted successfully.`);
    return data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
}
