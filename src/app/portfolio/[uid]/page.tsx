import { Overview } from "@/components/ui/overview";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getInvestorDeal } from "@/lib/data/query";
import PieChart from "@/components/pieChart";

export default async function Portfolio({
  params,
}: {
  params: { uid: string };
}) {
  const supabase = createSupabaseClient();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeekData = daysOfWeek.map((day) => ({ name: day, value: 0 }));
  const { data: deals, error } = await getInvestorDeal(supabase, params.uid);
  if (error) {
    console.error(error);
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
  }

  return (
    <div>
      {/* {JSON.stringify(params.uid)} */}
      {/* {JSON.stringify(deals)} */}
      {/* {JSON.stringify(dayOfWeekData)} */}
      {/* {JSON.stringify(overAllGraphData)} */}
      {/* {JSON.stringify(threeYearGraphData)} */}
      <div className="flex w-full gap-10">
        <Overview graphType="line" data={overAllGraphData}></Overview>
        <Overview graphType="bar" data={threeYearGraphData}></Overview>
        <Overview graphType="bar" data={dayOfWeekData}></Overview>
      </div>
      {/* <PieChart /> */}
    </div>
  );
}
