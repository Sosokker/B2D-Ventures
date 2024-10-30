import { Overview } from "@/components/ui/overview";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getInvestorDeal, getProjectTag, getTagName } from "@/lib/data/query";
import PieChart from "@/components/pieChart";
import { overAllGraphData, fourYearGraphData, dayOftheWeekData } from "./hook";

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
  const overAllData = deals ? overAllGraphData(deals) : [];
  const fourYearData = deals ? fourYearGraphData(deals) : [];
  const dayOfWeekData = deals ? dayOftheWeekData(deals) : [];

  const projectTag = async () => {
    // get unique project id from deals
    const uniqueProjectIds = Array.from(
      new Set(deals?.map((deal) => deal.project_id))
    );

    const tagIds = (
      await Promise.all(
        uniqueProjectIds.map(async (projectId: number) => {
          const { data: tagIdsArray, error: tagError } = await getProjectTag(
            supabase,
            projectId
          );
          if (tagError) {
            console.error(tagError);
            return [];
          }
          return tagIdsArray?.map((tag) => tag.tag_id) || [];
        })
      )
    ).flat();

    // console.log(tagIds, uniqueProjectIds);
    const tagNames = await Promise.all(
      tagIds
        .filter((tagId) => tagId !== null)
        .map(async (id: number) => {
          const { data: tagName, error: nameError } = await getTagName(
            supabase,
            id
          );
          if (nameError) {
            console.error(nameError);
            return null;
          }
          return tagName;
        })
    );
    // console.log(tagNames);
    return tagNames.filter((tagName) => tagName !== null);
  };
  const countTags = (tags: any[]) => {
    const tagCounts = tags.flat().reduce(
      (acc, tag) => {
        const tagName = tag.value;
        acc[tagName] = (acc[tagName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(tagCounts).map(([name, count]) => ({
      name,
      count: count as number,
    }));
  };
  const tags = await projectTag();
  // console.log(tags);
  const tagCount = countTags(tags);
  // console.log(tagCount);

  if (investorDealError) {
    console.error(investorDealError);
  }

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
