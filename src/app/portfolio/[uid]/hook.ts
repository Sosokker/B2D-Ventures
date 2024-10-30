// only use deal that were made at most year ago
interface Deal {
  created_time: string | number | Date;
  deal_amount: any;
}

interface GraphData {
  name: string;
  value: number;
}

function overAllGraphData(deals: Deal[]): GraphData[] {
  return deals
    ? deals
        .filter((item: Deal) => new Date(item.created_time) >= yearAgo(1))
        .reduce((acc: GraphData[], item: Deal) => {
          // get the first three initial letter of the month
          const monthName = getMonthName(item.created_time.toString()).slice(
            0,
            3
          );
          const existingMonth = acc.find(
            (entry: GraphData) => entry.name === monthName
          );

          if (existingMonth) {
            existingMonth.value += item.deal_amount;
          }
          //   if month doesnt exist yet, create new record
          else {
            acc.push({ name: monthName, value: item.deal_amount });
          }

          return acc;
        }, [] as GraphData[])
    : [];
}

interface Deal {
  created_time: string | number | Date;
  deal_amount: any;
}

interface GraphData {
  name: string;
  value: number;
}

function fourYearGraphData(deals: Deal[]): GraphData[] {
  return deals
    .filter((item: Deal) => new Date(item.created_time) >= yearAgo(3))
    .reduce((acc: GraphData[], item: Deal) => {
      const year = new Date(item.created_time).getFullYear();
      const existingYear = acc.find(
        (entry: GraphData) => entry.name === year.toString()
      );

      if (existingYear) {
        existingYear.value += item.deal_amount;
      } else {
        acc.push({ name: year.toString(), value: item.deal_amount });
      }

      return acc;
    }, [] as GraphData[]);
}

interface DayOfWeekData {
  name: string;
  value: number;
}

function dayOftheWeekData(deals: Deal[]): DayOfWeekData[] {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeekData: DayOfWeekData[] = daysOfWeek.map((day) => ({
    name: day,
    value: 0,
  }));
  deals
    .filter((item: Deal) => new Date(item.created_time) >= yearAgo(1))
    .forEach((item: Deal) => {
      const day = getDayAbbreviation(item.created_time);
      const dayEntry = dayOfWeekData.find((entry) => entry.name === day);
      if (dayEntry) {
        dayEntry.value += item.deal_amount;
      }
    });
  return dayOfWeekData;
}
const getDayAbbreviation = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { weekday: "short" });
};

const yearAgo = (num: number) => {
  const newDate = new Date();
  newDate.setFullYear(newDate.getFullYear() - num);
  return newDate;
};

const getMonthName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};

export { overAllGraphData, fourYearGraphData, dayOftheWeekData };
