import { SupabaseClient } from "@supabase/supabase-js";

function getBusinesses(client: SupabaseClient, query: string | null) {
  return client
    .from("business")
    .select("id, business_name, joined_date")
    .ilike("business_name", `%${query}%`);
}

function getProjects(client: SupabaseClient, businessIds: string[]) {
  return client
    .from("project")
    .select(
      `
            id,
            project_name,
            business_id,
            published_time,
            project_short_description,
            project_investment_detail (
                min_investment,
                total_investment,
                target_investment
            )
        `
    )
    .in("business_id", businessIds);
}

function getTags(client: SupabaseClient, projectIds: string[]) {
  return client
    .from("item_tag")
    .select("item_id, tag (value)")
    .in("item_id", projectIds);
}

function getInvestmentCounts(client: SupabaseClient, projectIds: string[]) {
  return client
    .from("investment_deal")
    .select("*", {
      count: "exact",
      head: true,
    })
    .in("project_id", projectIds);
}

function getInvestorDeal(client: SupabaseClient, userId: string) {
  return client.from("investment_deal").select("*").in("investor_id", [userId]);
}

export {
  getBusinesses,
  getInvestmentCounts,
  getProjects,
  getTags,
  getInvestorDeal,
};
