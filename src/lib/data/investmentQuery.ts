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

export const getInvestmentByProjectsIds = (client: SupabaseClient, projectIds: string[]) => {
  return client.from("investment_deal").select("*").in("project_id", projectIds);
};

export const getInvestmentByUserId = (client: SupabaseClient, userId: string) => {
  return client
    .from("investment_deal")
    .select(
      `
    id,
    ...project_id (
      project_id:id,
      project_name,
      project_short_description,
      dataroom_id
    ),
    deal_amount,
    investor_id,
    created_time
    `
    )
    .eq("investor_id", userId);
};

export function getInvestorDeal(client: SupabaseClient, userId: string) {
  return client
    .from("investment_deal")
    .select("*")
    .in("investor_id", [userId])
    .order("created_time", { ascending: true });
}
