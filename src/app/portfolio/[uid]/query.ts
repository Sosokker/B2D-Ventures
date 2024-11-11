import { SupabaseClient } from "@supabase/supabase-js";
import { getProjectTag, getTagName } from "@/lib/data/tagQuery";

async function fetchLogoURL(supabase: SupabaseClient, projectId: number) {
  const logoIndex = 1;
  let { data: project_material, error } = await supabase
    .from("project_material")
    .select("material_url")
    .eq("project_id", projectId)
    .eq("material_type_id", logoIndex);
  if (error) {
    console.error("Error while fetching golo url" + error);
  }
  if (project_material && project_material.length > 0) {
    return project_material[0].material_url;
  }
  return "";
}

function getTotalInvestment(deals: { deal_amount: number }[]) {
  let total = 0;
  for (let index = 0; index < deals.length; index++) {
    total += deals[index].deal_amount;
  }
  return total;
}
async function getLatestInvestment(
  supabase: SupabaseClient,
  deals: { project_id: number; deal_amount: number; created_time: Date;}[]
) {
  const llist = [];
  const count = 5;
  // select project name from the given id
  for (let i = deals.length - 1; i >= 0 && llist.length < count; --i) {
    let { data: project, error } = await supabase.from("project").select("project_name").eq("id", deals[i].project_id);
    if (error) {
      console.error(error);
    }
    let url = fetchLogoURL(supabase, deals[i].project_id);
    llist.push({
      projectId: deals[i].project_id,
      name: project?.[0]?.project_name,
      amount: deals[i].deal_amount,
      date: new Date(deals[i].created_time),
      logo_url: url,
    });
  }

  return llist;
}

async function checkForInvest(supabase: SupabaseClient, userId: string) {
  let { count, error } = await supabase
    .from("investment_deal")
    .select("*", { count: "exact" })
    .eq("investor_id", userId);
  if (error) {
    console.error(error);
    return false;
  }
  // if user already invest in something
  if (count !== null && count > 0) {
    return true;
  }
  return false;
}

function countValues(arr: { value: string }[][]): Record<string, number> {
  const counts: Record<string, number> = {};

  arr.forEach((subArray) => {
    subArray.forEach((item) => {
      const value = item.value;
      counts[value] = (counts[value] || 0) + 1;
    });
  });

  return counts;
}

async function getBusinessTypeName(supabase: SupabaseClient, projectId: number) {
  // step 1: get business id from project id
  let { data: project, error: projectError } = await supabase.from("project").select("business_id").eq("id", projectId);
  if (projectError) {
    console.error(projectError);
  }

  //  step 2: get business type's id from business id
  let { data: business, error: businessError } = await supabase
    .from("business")
    .select("business_type")
    .eq("id", project?.[0]?.business_id);
  if (businessError) {
    console.error(businessError);
  }
  // step 3: get business type from its id
  let { data: business_type, error: businessTypeError } = await supabase
    .from("business_type")
    .select("value")
    .eq("id", business?.[0]?.business_type);
  if (businessTypeError) {
    console.error(businessError);
  }
  return business_type;
}

// only use deal that were made at most year ago
export interface Deal {
  created_time: string | number | Date;
  deal_amount: any;
}

interface GraphData {
  name: string;
  value: number;
}

function overAllGraphData(deals: Deal[]): GraphData[] {
  // Initialize all months with value 0
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const acc: GraphData[] = months.map((month) => ({ name: month, value: 0 }));

  deals
    .filter((item: Deal) => new Date(item.created_time) >= yearAgo(1))
    .forEach((item: Deal) => {
      const monthName = getMonthName(item.created_time.toString()).slice(0, 3);
      const monthEntry = acc.find((entry) => entry.name === monthName);

      if (monthEntry) {
        monthEntry.value += item.deal_amount;
      }
    });

  return acc;
}

function fourYearGraphData(deals: Deal[]): GraphData[] {
  const currentYear = new Date().getFullYear();
  const acc: GraphData[] = Array.from({ length: 4 }, (_, i) => ({
    name: (currentYear - i).toString(),
    value: 0,
  })).reverse();
  deals
    .filter((item: Deal) => new Date(item.created_time) >= yearAgo(3))
    .forEach((item: Deal) => {
      const year = new Date(item.created_time).getFullYear().toString();
      const yearEntry = acc.find((entry) => entry.name === year);

      if (yearEntry) {
        yearEntry.value += item.deal_amount;
      }
    });

  return acc;
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
async function getInvestorProjectTag(supabase: SupabaseClient, deals: number | { project_id: number }[]) {
  // get unique project id from deals
  const uniqueProjectIds: number[] = Array.isArray(deals)
    ? Array.from(new Set(deals.map((deal: { project_id: number }) => deal.project_id)))
    : [];

  const tagIds = (
    await Promise.all(
      uniqueProjectIds.map(async (projectId: number) => {
        const { data: tagIdsArray, error: tagError } = await getProjectTag(supabase, projectId);
        if (tagError) {
          console.error(tagError);
          return [];
        }
        return tagIdsArray?.map((tag: { tag_id: any }) => tag.tag_id) || [];
      })
    )
  ).flat();

  // console.log(tagIds, uniqueProjectIds);
  const tagNames = await Promise.all(
    tagIds
      .filter((tagId) => tagId !== null)
      .map(async (id: number) => {
        const { data: tagName, error: nameError } = await getTagName(supabase, id);
        if (nameError) {
          console.error(nameError);
          return null;
        }
        return tagName;
      })
  );
  // console.log(tagNames);
  return tagNames.filter((tagName) => tagName !== null);
}
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

export {
  overAllGraphData,
  fourYearGraphData,
  dayOftheWeekData,
  getInvestorProjectTag,
  countTags,
  getBusinessTypeName,
  countValues,
  checkForInvest,
  getLatestInvestment,
  getTotalInvestment,
  fetchLogoURL,
};
