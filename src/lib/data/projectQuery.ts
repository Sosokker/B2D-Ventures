import { SupabaseClient } from "@supabase/supabase-js";

async function getTopProjects(client: SupabaseClient, numberOfRecords: number = 4) {
    try {
      const { data, error } = await client
        .from("Project")
        .select(
          `
            id,
            projectName,
            businessId,
            publishedTime,
            projectShortDescription,
            cardImage,
            ProjectInvestmentDetail (
              minInvestment,
              totalInvestment,
              targetInvestment,
              investmentDeadline
            ),
            ItemTag (
              Tag (
                id,
                value
              )
            ),
            Business (
              location
            )
          `
        )
        .order("publishedTime", { ascending: false })
        .limit(numberOfRecords);

      if (error) {
        console.error("Error fetching top projects:", error.message);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { data: null, error: "An unexpected error occurred." };
    }
  }

async function searchProjects(client: SupabaseClient, searchTerm: string | null, page: number = 1, pageSize: number = 4) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  try {
    let query = client.from("Project").select(
      `
        id,
        projectName,
        businessId,
        publishedTime,
        projectShortDescription,
        cardImage,
        ProjectInvestmentDetail (
          minInvestment,
          totalInvestment,
          targetInvestment,
          investmentDeadline
        ),
        ItemTag (
          Tag (
            id,
            value
          )
        ),
        Business (
          location
        )
      `
    ).order("publishedTime", { ascending: false })
      .range(start, end);

    if (searchTerm) {
      query = query.ilike('projectName', `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error searching projects:", error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { data: null, error: "An unexpected error occurred." };
  }
}

export interface FilterParams {
  searchTerm?: string;
  tagsFilter?: string[];
  projectStatus?: string;
  projectStatusFilter?: string;
  businessTypeFilter?: string;
  sortByTimeFilter?: string;
}

export interface FilterProjectQueryParams extends FilterParams {
  page: number,
  pageSize: number
}

function searchProjectsQuery(client: SupabaseClient, {searchTerm, tagsFilter, projectStatus, businessTypeFilter, sortByTimeFilter, page = 1, pageSize = 4}: FilterProjectQueryParams) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  
  let query = client.from("Project").select(
    `
    id,
    project_name:projectName,
    published_time:publishedTime,
    project_short_description:projectShortDescription,
    card_image_url:cardImage,
    ...ProjectStatus!Project_projectStatusId_fkey!inner (
      project_status:value
    ),
    ...ProjectInvestmentDetail!inner (
      min_investment:minInvestment,
      total_investment:totalInvestment,
      target_investment:targetInvestment,
      investment_deadline:investmentDeadline
    ),
    tags:ItemTag!inner (
      ...Tag!inner (
        tag_name:value
      )
    ),
    ...Business!inner (
      ...businessType!inner (
        business_type:value
      ),
      business_location:location
    )
    `
  ).order("publishedTime", { ascending: false }).range(start, end)

  if (sortByTimeFilter === "all") {
    sortByTimeFilter = undefined;
  }

  if (projectStatus === "all") {
    projectStatus = undefined;
  }

  if (businessTypeFilter === "all") {
    businessTypeFilter = undefined;
  }

  if (tagsFilter?.length === 0) {
    tagsFilter = undefined;
  }

  if (searchTerm) {
    query = query.ilike('projectName', `%${searchTerm}%`)
  }

  if (tagsFilter) {
    query = query.in('ItemTag.Tag.value', tagsFilter)
  }

  if (projectStatus) {
    query = query.eq("ProjectStatus.value", projectStatus)
  }

  if (businessTypeFilter) {
    query = query.eq("Business.businessType.value", businessTypeFilter)
  }

  return query;
}


export { getTopProjects, searchProjects, searchProjectsQuery };

