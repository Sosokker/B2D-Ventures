import { createClient } from "@supabase/supabase-js";
import { getUserUidByEmail } from "./getUser";

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabase_url) {
  throw "Supabase Url is undefine";
}

if (!supabase_role_key) {
  throw "Supabase Anon Key is undefine";
}

const supabase = createClient(supabase_url, supabase_role_key);

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

export async function deleteUserByEmail(email: string): Promise<boolean> {
  const { data: uid, error } = await getUserUidByEmail(email);
  if (error) {
    console.error(`Error delete user with email: ${email}`, error);
    return false;
  }
  if (!uid) {
    console.error(`UID is null`);
    return false;
  }
  await deleteUser(uid);
  console.log(`Successfully delete user with email: ${email} and UID: ${uid}`);
  return true;
}
