import { Overview } from "@/components/ui/overview";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getInvestorDeal } from "@/lib/data/query";
import PieChart from "@/components/pieChart";
import {
  overAllGraphData,
  fourYearGraphData,
  dayOftheWeekData,
  getInvestorProjectTag,
  countTags,
  getBusinessTypeName,
} from "./hook";
import CountUpComponent from "@/components/countUp";

export default async function Portfolio({
  params,
}: {
  params: { uid: string };
}) {
  const supabase = createSupabaseClient();
  const { data: deals, error: investorDealError } = await getInvestorDeal(
    supabase,
    params.uid
  );
  if (investorDealError) {
    console.error(investorDealError);
  }
  const overAllData = deals ? overAllGraphData(deals) : [];
  const fourYearData = deals ? fourYearGraphData(deals) : [];
  const dayOfWeekData = deals ? dayOftheWeekData(deals) : [];
  const tags = deals ? await getInvestorProjectTag(supabase, deals) : [];
  const tagCount = countTags(tags);
  // console.log(investedBusinessIds);
  const businessType = deals
    ? await Promise.all(
        deals.map(
          async (item) => await getBusinessTypeName(supabase, item.project_id)
        )
      )
    : [];
  console.log(businessType);

  // console.log(tagCount);
  return (
    <div>
      {/* {JSON.stringify(params.uid)} */}
      {/* {JSON.stringify(tagCount)} */}
      {JSON.stringify(deals)}
      {/* {JSON.stringify(dayOfWeekData)} */}
      {/* {JSON.stringify(overAllGraphData)} */}
      {/* {JSON.stringify(threeYearGraphData)} */}
      {/* {JSON.stringify(uniqueProjectIds)} */}
      {/* <div className="flex flex-row">
        <h1>Total Invest :  </h1>
        <div>{totalInvest}</div>
      </div> */}
      {/* <CountUpComponent end={100} duration={3} /> */}
      <div className="flex w-full gap-10">
        <Overview graphType="line" data={overAllData}></Overview>
        <Overview graphType="bar" data={fourYearData}></Overview>
        <Overview graphType="bar" data={dayOfWeekData}></Overview>
      </div>
      <div className="w-96">
        <PieChart
          data={tagCount.map(
            (item: { name: string; count: number }) => item.count
          )}
          labels={tagCount.map(
            (item: { name: string; count: number }) => item.name
          )}
          header="Total"
        />
      </div>
    </div>
  );
}
