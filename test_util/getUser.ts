import { createClient, PostgrestError } from "@supabase/supabase-js";

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabase_url) {
  throw "Supabase Url is undefine";
}

if (!supabase_role_key) {
  throw "Supabase Anon Key is undefine";
}

const supabase = createClient(supabase_url, supabase_role_key);

export async function getUserUidByEmail(email: string): Promise<{ data: string | null; error: PostgrestError | null }> {
  try {
    const { data, error } = await supabase.rpc("get_user_id_by_email", {
      email: email,
    });
    if (error) {
      console.error(`Error retrive user with email: ${email}`, error);
      return { data: null, error: error };
    }

    if (!data) {
      console.error(`No user with email: ${email}`, error);
      return { data: null, error: error };
    }

    console.log(`Retrieve UID successfully.`);
    return { data: data[0].id, error: error };
  } catch (error) {
    console.error(`Error retrive user with email: ${email}`, error);
    throw error;
  }
}
