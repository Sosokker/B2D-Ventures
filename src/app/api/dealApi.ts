import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { getCurrentUserID } from "./userApi";

export type Deal = {
  deal_amount: number;
  created_time: Date;
  investor_id: string;
};

// Sort the dealList by created_time in descending order
export function byCreatedTimeDesc(a: Deal, b: Deal) {
  return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
}

export async function getDealList() {
  const supabase = createSupabaseClient();
  const { data: dealData, error } = await supabase
    .from('business')
    .select(`
      project (
        investment_deal (
          deal_amount,
          created_time,
          investor_id
        )
      )
    `)
    .eq('user_id', await getCurrentUserID())
    .single();

  if (error) {
    alert(JSON.stringify(error));
    console.error('Error fetching deal list:', error);
    return; // Exit on error
  }

  if (!dealData || !dealData.project.length) {
    alert("No project available");
    return; // Exit if there's no data
  }

  const flattenedDeals = dealData.project.flatMap((proj) =>
    proj.investment_deal.map((deal) => ({
      deal_amount: deal.deal_amount,
      created_time: deal.created_time,
      investor_id: deal.investor_id,
    }))
  )

  // Check for empty dealList
  if (!flattenedDeals.length) {
    alert("No deal list available");
    return; // Exit if there's no data
  }
  return flattenedDeals.sort(byCreatedTimeDesc);
};

export async function getRecentDealData() {
  const supabase = createSupabaseClient();
  let dealList = await getDealList();

  if (!dealList) {
    // #TODO div no deals available?
    return;
  }
  
  dealList = dealList.slice(0, 5)

  const investorIdList: string[] = dealList.map(deal => deal.investor_id);
  const { data: userData, error } = await supabase
    .from("profiles")
    .select("username, avatar_url")   // #TODO add email
    .in("id", investorIdList); // Filter by investor_id

  if (error) {
    // Handle the error and return a meaningful message
    console.error("Error fetching usernames and avatars:", error);
  }

  alert(JSON.stringify(userData));
  return userData || [];
}

// #TODO move to util
export function convertToGraphData(deals: Deal[]): Record<string, number> {
  // group by year & month
  let graphData = deals.reduce((acc, deal) => {
    const monthYear = new Date(deal.created_time).toISOString().slice(0, 7); // E.g., '2024-10'
    acc[monthYear] = (acc[monthYear] || 0) + deal.deal_amount; // Sum the deal_amount
    return acc;
  }, {} as Record<string, number>); // Change type to Record<string, number>

  // Sort keys in ascending order
  const sortedKeys = Object.keys(graphData).sort((a, b) => (a > b ? 1 : -1));

  // Create a sorted graph data object
  const sortedGraphData: Record<string, number> = {};
  sortedKeys.forEach((key) => {sortedGraphData[key] = graphData[key]});
  return sortedGraphData;
}