import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

let supabaseClient: ReturnType<typeof createServerClient> | null = null;

// This is singleton
export function createSupabaseClient() {
  if (!supabaseClient) {
    const cookieStore = cookies();

    supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch (error) {
              console.error("Error setting cookies:", error);
            }
          },
        },
      }
    );
  }

  return supabaseClient;
}