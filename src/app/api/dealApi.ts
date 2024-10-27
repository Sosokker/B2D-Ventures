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

    if (error || !dealData) {
      alert(JSON.stringify(error));
      console.error('Error fetching deal list:', error);
    } else {
      const dealList = dealData.project[0].investment_deal;

      if (!dealList.length) {
        alert("No data available");
        return; // Exit early if there's no data
      }

      // Sort the dealList by created_time in descending order
      const byCreatedTimeDesc = (a: Deal, b: Deal) =>
        new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
      return dealList.sort(byCreatedTimeDesc);
    }
};