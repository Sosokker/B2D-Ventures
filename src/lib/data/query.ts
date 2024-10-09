import { SupabaseClient } from "@supabase/supabase-js";

function getBusinesses(client: SupabaseClient, query: string | null) {
  return client.from("Business").select("id, businessName, joinedDate").ilike("businessName", `%${query}%`);
}

function getProjects(client: SupabaseClient, businessIds: string[]) {
  return client
    .from("Project")
    .select(
      `
            id,
            projectName,
            businessId,
            publishedTime,
            projectShortDescription,
            ProjectInvestmentDetail (
                minInvestment,
                totalInvestment,
                targetInvestment
            )
        `
    )
    .in("businessId", businessIds);
}

function getTags(client: SupabaseClient, projectIds: string[]) {
  return client.from("ItemTag").select("itemId, Tag (value)").in("itemId", projectIds);
}

function getInvestmentCounts(client: SupabaseClient, projectIds: string[]) {
  return client.from("InvestmentDeal").select("*", { count: "exact", head: true }).in("projectId", projectIds);
}

export { getBusinesses, getProjects, getTags, getInvestmentCounts };