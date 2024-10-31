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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RecentFunds } from "@/components/recent-funds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionMarkIcon from "@/components/icon/questionMark";
import { NoDataAlert } from "@/components/alert/noData/alert";

export default async function Portfolio({
  params,
}: {
  params: { uid: string };
}) {
  const supabase = createSupabaseClient();
  //  if user hasn't invest in anything
  if (!(await checkForInvest(supabase, params.uid))) {

    return (
      <div>
        <NoDataAlert />
      </div>
    );
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
    <div className="p-5">
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
      <div className="flex flew-rows-3 gap-10 mt-5 w-full">
        <Tabs defaultValue="daily" className="space-y-4 w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-bold">
                  Monthly Investment Trend
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <QuestionMarkIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Displays total investments each month over the past 12{" "}
                        <br />
                        months, up to today.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent className="mt-5">
                <Overview
                  graphType="line"
                  data={overAllData}
                  graphHeight={500}
                ></Overview>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="yearly">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-bold">
                  Yearly Investment Summary
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <QuestionMarkIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Shows total investments for each of the last four years,{" "}
                        <br />
                        including the current year to date.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent className="mt-5">
                <Overview
                  graphType="bar"
                  data={fourYearData}
                  graphHeight={500}
                ></Overview>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="daily">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-bold">
                  Daily Investment Breakdown
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <QuestionMarkIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Illustrates total investments for each day over the past{" "}
                        <br />
                        year, up to today.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent className="mt-5">
                <Overview
                  graphType="bar"
                  data={dayOfWeekData}
                  graphHeight={500}
                ></Overview>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-cols-3 w-full gap-5 mt-5">
        <Card className="w-1/3">
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
        <Card className="w-1/3">
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
        <Card className="w-1/3">
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
