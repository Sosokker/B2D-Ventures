import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { getCurrentUserID } from "./userApi";

export type Deal = {
  deal_amount: number;
  created_time: Date;
  investor_id: string;
};

export async function getDealList() {
  const supabase = createSupabaseClient();
  const { data: dealData, error } = await supabase
    .from('business')
    .select(`
      id,
      project (
        id,
        investment_deal (
          deal_amount,
          created_time,
          investor_id
        )
      )
    `)
    .eq('user_id', await getCurrentUserID())
    .single();

  // Handle errors and no data cases
  if (error) {
    alert(JSON.stringify(error));
    console.error('Error fetching deal list:', error);
    return; // Exit on error
  }

  if (!dealData || !dealData.project.length) {
    alert("No project available");
    return; // Exit if there's no data
  }

  const dealList = dealData.project[0].investment_deal;

  // Check for empty dealList
  if (!dealList.length) {
    alert("No deal list available");
    return; // Exit if there's no data
  }

  // Sort the dealList by created_time in descending order
  const byCreatedTimeDesc = (a: Deal, b: Deal) =>
    new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
  return dealList.sort(byCreatedTimeDesc);
};

// #TODO move to util
export function convertToGraphData(deals: Deal[]): Record<string, number> {
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