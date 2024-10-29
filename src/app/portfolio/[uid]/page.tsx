import { Overview } from "@/components/ui/overview";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getInvestorDeal } from "@/lib/data/query";

export default async function Portfolio({
  params,
}: {
  params: { uid: string };
}) {
  const supabase = createSupabaseClient();
  const { data: deals, error } = await getInvestorDeal(supabase, params.uid);
  if (error) {
    console.error(error);
  }
  const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long" });
  };

  const graphData = deals
    ? deals.map((item) => ({
      // convert month's index to string
        name: getMonthName(item.created_time),
        value: item.deal_amount as number,
      }))
    : [];

  return (
    <div>
      {/* {JSON.stringify(deals)} */}
      {JSON.stringify(graphData)}
      <Overview graphType="line" data={graphData}></Overview>
    </div>
  );
}
