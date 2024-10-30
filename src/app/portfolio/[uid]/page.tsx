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
  countValues,
  checkForInvest,
} from "./hook";
import CountUpComponent from "@/components/countUp";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RecentFunds } from "@/components/recent-funds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionMarkIcon from "@/components/icon/questionMark";

export default async function Portfolio({
  params,
}: {
  params: { uid: string };
}) {
  const supabase = createSupabaseClient();
  //  if user hasn't invest in anything
  if (!(await checkForInvest(supabase, params.uid))) {
  }
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
  const countedBusinessType = countValues(
    businessType.filter((item) => item !== null)
  );
  // console.log(countedBusinessType);

  // console.log(tagCount);
  return (
    <div>
      {/* {JSON.stringify(params.uid)} */}
      {/* {JSON.stringify(tagCount)} */}
      {/* {JSON.stringify(deals)} */}
      {/* {JSON.stringify(dayOfWeekData)} */}
      {/* {JSON.stringify(overAllGraphData)} */}
      {/* {JSON.stringify(threeYearGraphData)} */}
      {/* {JSON.stringify(uniqueProjectIds)} */}
      {/* <div className="flex flex-row">
        <h1>Total Invest :  </h1>
        <div>{totalInvest}</div>
      </div> */}
      {/* <CountUpComponent end={100} duration={3} /> */}
      <div className="flex flew-rows-3 gap-10 mt-5">
        <Card className="w-[500px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">
              Types of Businesses Invested In
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-5">
            <Overview graphType="line" data={overAllData}></Overview>
          </CardContent>
        </Card>
        <Card className="w-[500px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">
              Types of Businesses Invested In
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-5">
            <Overview graphType="bar" data={fourYearData}></Overview>
          </CardContent>
        </Card>
        <Card className="w-[500px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">
              Types of Businesses Invested In
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-5">
            <Overview graphType="bar" data={dayOfWeekData}></Overview>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-cols-3 w-96 gap-5 mt-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">
              Categories of Invested Projects
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <QuestionMarkIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Displays the distribution of project tags in your <br />
                    investments, highlighting areas of interest.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="mt-5">
            <PieChart
              data={tagCount.map(
                (item: { name: string; count: number }) => item.count
              )}
              labels={tagCount.map(
                (item: { name: string; count: number }) => item.name
              )}
              header="Total"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">
              Types of Businesses Invested In
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <QuestionMarkIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Shows the breakdown of business types in your portfolio,{" "}
                    <br />
                    illustrating sector diversity.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="mt-5">
            <PieChart
              data={Object.values(countedBusinessType)}
              labels={Object.keys(countedBusinessType)}
              header="Total"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">
              Recent investment
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-5">
            <RecentFunds />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
