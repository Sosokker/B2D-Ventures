"use client";

import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { getUserRole } from "@/lib/data/userQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

export function useUserRole() {
  const client = createSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionError, setSessionError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const {
          data: { session },
          error,
        } = await client.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (error) {
        setSessionError(error as Error);
        console.error("Error fetching session:", error);
      }
    }

    fetchSession();
  }, [client.auth]);

  const { data, isLoading, error: userRoleError } = useQuery(getUserRole(client, session?.user?.id!));

  return {
    data,
    isLoading: isLoading || !session,
    error: userRoleError || sessionError,
    session,
    userId: session?.user?.id,
  };
}
