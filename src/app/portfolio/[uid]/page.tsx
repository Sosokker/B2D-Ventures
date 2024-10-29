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
  const yearAgo = (num: number) => {
    const newDate = new Date();
    newDate.setFullYear(newDate.getFullYear() - num);
    return newDate;
  };

  const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

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
            (entry: { name: string; }) => entry.name === year.toString()
          );

          if (existingYear) {
            existingYear.value += item.deal_amount;
          } else {
            acc.push({ name: year.toString(), value: item.deal_amount })
          }

          return acc;
        },
        [] as { name: string; value: number }[]
      )
  : [];



  // const graphData = [
  //   { name: "October", value: 500 },
  //   { name: "October", value: 500 },
  //   { name: "November", value: 500 },
  //   { name: "December", value: 500 },
  //   { name: "January", value: 500 },
  //   { name: "Febuary", value: 500 },
  //   { name: "March", value: 500 },
  // ];

  return (
    <div>
      {/* {JSON.stringify(deals)} */}
      {/* {JSON.stringify(deals)} */}
      {/* {JSON.stringify(threeYearGraphData)} */}
      <div className="flex w-full gap-10">
        <Overview graphType="line" data={overAllGraphData}></Overview>
        <Overview graphType="bar" data={threeYearGraphData}></Overview>
      </div>
    </div>
  );
}
