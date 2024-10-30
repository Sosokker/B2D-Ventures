import { Overview } from "@/components/ui/overview";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getInvestorDeal, getProjectTag, getTagName } from "@/lib/data/query";
import PieChart from "@/components/pieChart";

export default async function Portfolio({
  params,
}: {
  params: { uid: string };
}) {
  const supabase = createSupabaseClient();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeekData = daysOfWeek.map((day) => ({ name: day, value: 0 }));
  const { data: deals, error: investorDealError } = await getInvestorDeal(
    supabase,
    params.uid
  );

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

  const yearAgo = (num: number) => {
    const newDate = new Date();
    newDate.setFullYear(newDate.getFullYear() - num);
    return newDate;
  };

  const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // only use deal that were made at most year ago
  const overAllGraphData = deals
    ? deals
        .filter((item) => new Date(item.created_time) >= yearAgo(1))
        .reduce(
          (acc, item) => {
            const monthName = getMonthName(item.created_time).slice(0, 3);
            const existingMonth = acc.find(
              (entry: { name: string }) => entry.name === monthName
            );

            if (existingMonth) {
              existingMonth.value += item.deal_amount;
            } else {
              acc.push({ name: monthName, value: item.deal_amount });
            }

            return acc;
          },
          [] as { name: string; value: number }[]
        )
    : [];

  const threeYearGraphData = deals
    ? deals
        .filter((item) => new Date(item.created_time) >= yearAgo(3))
        .reduce(
          (acc, item) => {
            const year = new Date(item.created_time).getFullYear();
            const existingYear = acc.find(
              (entry: { name: string }) => entry.name === year.toString()
            );

            if (existingYear) {
              existingYear.value += item.deal_amount;
            } else {
              acc.push({ name: year.toString(), value: item.deal_amount });
            }

            return acc;
          },
          [] as { name: string; value: number }[]
        )
    : [];
  const getDayAbbreviation = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { weekday: "short" });
  };

  let totalInvest = 0;
  if (deals) {
    deals
      .filter((item) => new Date(item.created_time) >= yearAgo(1))
      .forEach((item) => {
        const day = getDayAbbreviation(item.created_time);
        const dayEntry = dayOfWeekData.find((entry) => entry.name === day);
        if (dayEntry) {
          dayEntry.value += item.deal_amount;
        }
      });
    totalInvest = deals.reduce((acc, item) => acc + item.deal_amount, 0);
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
        <Overview graphType="line" data={overAllGraphData}></Overview>
        <Overview graphType="bar" data={threeYearGraphData}></Overview>
        <Overview graphType="bar" data={dayOfWeekData}></Overview>
      </div>
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
  );
}
