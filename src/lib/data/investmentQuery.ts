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
  return client
    .from("investment_deal")
    .select(
      `
    id, 
    ...deal_status_id(
      deal_status:value
      ),
    project_id,
    deal_amount,
    created_time,
    ...profiles (
      investor_id:id,
      username,
      avatar_url
    )
    `
    )
    .in("project_id", projectIds)
    .order("created_time", { ascending: false });
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
    .select(
      `
    id, 
    ...deal_status_id(
      deal_status:value
      ),
    project_id,
    deal_amount,
    created_time,
    ...profiles (
      investor_id:id,
      username,
      avatar_url
    )
    `
    )
    .in("investor_id", [userId])
    .order("created_time", { ascending: true });
}
