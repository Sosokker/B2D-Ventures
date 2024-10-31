import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";

export type Deal = {
  deal_amount: number;
  created_time: Date;
  investor_id: string;
};

export async function getDealList(userId: string | undefined) {
  if (!userId) {
    // console.error("No deal list of this user was found");
    return; // Exit on error
  }

  const supabase = createSupabaseClient();
  // get id of investors who invest in the business
  const { data: dealData, error: dealError } = await supabase
    .from("business")
    .select(
      `
      project (
        investment_deal (
          investor_id
        )
      )
    `
    )
    .eq("user_id", userId)
    .single();

  if (dealError) {
    // alert(JSON.stringify(dealError));
    console.error("Error fetching deal list:", dealError);
    return; // Exit on error
  }

  if (!dealData || !dealData.project.length) {
    alert("No project available");
    return; // Exit if there's no data
  }

  const investorIdList = dealData.project[0].investment_deal.map((deal) => deal.investor_id);

  // get investment_deal data then sort by created_time
  const { data: sortedDealData, error: sortedDealDataError } = await supabase
    .from("investment_deal")
    .select(
      `
      deal_amount,
      created_time,
      investor_id
    `
    )
    .in("investor_id", investorIdList)
    .order("created_time", { ascending: false });

  if (sortedDealDataError) {
    alert(JSON.stringify(sortedDealDataError));
    console.error("Error sorting deal list:", sortedDealDataError);
    return; // Exit on error
  }

  console.log(sortedDealData)
  return sortedDealData;
}

// #TODO fix query to be non unique
export async function getRecentDealData(userId: string | undefined) {
  if (!userId) {
    console.error("User not found");
    return; // Exit on error
  }
  
  const supabase = createSupabaseClient();
  const dealList = await getDealList(userId);

  if (!dealList) {
    // #TODO div error
    console.error("No deal available");
    return;
  }

  // get 5 most recent investor
  const recentDealList = dealList.slice(0, 5);
  const recentInvestorIdList = recentDealList.map((deal) => deal.investor_id);

  const { data: recentUserData, error: recentUserError } = await supabase
    .from("profiles")
    .select(
      `
      username,
      avatar_url
    `
    )
    .in("id", recentInvestorIdList);

  if (!recentUserData) {
    alert("No recent users available");
    return;
  }

  if (recentUserError) {
    // Handle the error and return a meaningful message
    console.error("Error fetching profiles:", recentUserError);
    return;
    // #TODO div error
  }

  // combine two arrays
  const recentDealData = recentDealList.map((item, index) => {
    return { ...item, ...recentUserData[index] };
  });

  
  return recentDealData;
}

// #TODO refactor using supabase query instead of manual
// #TODO move to util
export function convertToGraphData(deals: Deal[]): Record<string, number> {
  // group by year & month
  let graphData = deals.reduce(
    (acc, deal) => {
      const monthYear = new Date(deal.created_time).toISOString().slice(0, 7); // E.g., '2024-10'
      acc[monthYear] = (acc[monthYear] || 0) + deal.deal_amount; // Sum the deal_amount
      return acc;
    },
    {} as Record<string, number>
  ); // Change type to Record<string, number>

  // Sort keys in ascending order
  const sortedKeys = Object.keys(graphData).sort((a, b) => (a > b ? 1 : -1));

  // Create a sorted graph data object
  const sortedGraphData: Record<string, number> = {};
  sortedKeys.forEach((key) => {sortedGraphData[key] = graphData[key]});
  return sortedGraphData;
}
