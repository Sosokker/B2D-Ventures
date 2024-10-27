import { SupabaseClient } from "@supabase/supabase-js";

export const getInvestmentCountsByProjectsIds = (client: SupabaseClient, projectIds: string[]) => {
  return client
    .from("investment_deal")
    .select("*", {
      count: "exact",
      head: true,
    })
    .in("project_id", projectIds);
};
