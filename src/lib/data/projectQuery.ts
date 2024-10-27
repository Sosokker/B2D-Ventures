import { SupabaseClient } from "@supabase/supabase-js";

async function getTopProjects(client: SupabaseClient, numberOfRecords: number = 4) {
  try {
    const { data, error } = await client
      .from("project")
      .select(
        `
            id,
            project_name,
            business_id,
            published_time,
            project_short_description,
            card_image_url,
            project_investment_detail (
              min_investment,
              total_investment,
              target_investment,
              investment_deadline
            ),
            project_tag (
              tag (
                id,
                value
              )
            ),
            business (
              location
            )
          `
      )
      .order("published_time", { ascending: false })
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

function getProjectDataQuery(client: SupabaseClient, projectId: number) {
  return client
    .from("project")
    .select(
      `
      project_name,
      project_short_description,
      project_description,
      published_time,
      ...project_investment_detail!inner (
        min_investment,
        total_investment,
        target_investment,
        investment_deadline
      ),
      tags:project_tag!inner (
        ...tag!inner (
          tag_name:value
        )
      )
    `
    )
    .eq("id", projectId)
    .single();
}

async function getProjectData(client: SupabaseClient, projectId: number) {
  const query = client
    .from("project")
    .select(
      `
      project_name,
      project_short_description,
      project_description,
      published_time,
      ...project_investment_detail!inner (
        min_investment,
        total_investment,
        target_investment,
        investment_deadline
      ),
      tags:project_tag!inner (
        ...tag!inner (
          tag_name:value
        )
      )
    `
    )
    .eq("id", projectId)
    .single();

  const { data, error } = await query;
  return { data, error };
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
  page: number;
  pageSize: number;
}

function searchProjectsQuery(
  client: SupabaseClient,
  {
    searchTerm,
    tagsFilter,
    projectStatus,
    businessTypeFilter,
    sortByTimeFilter,
    page = 1,
    pageSize = 4,
  }: FilterProjectQueryParams
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = client
    .from("project")
    .select(
      `
    project_id:id,
    project_name,
    published_time,
    project_short_description,
    card_image_url,
    ...project_status!inner (
      project_status:value
    ),
    ...project_investment_detail!inner (
      min_investment,
      total_investment,
      target_investment,
      investment_deadline
    ),
    tags:project_tag!inner (
      ...tag!inner (
        tag_name:value
      )
    ),
    ...business!inner (
      ...business_type!inner (
        business_type:value
      ),
      business_location:location
    )
    `
    )
    .order("published_time", { ascending: false })
    .range(start, end);

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
    query = query.ilike("project_name", `%${searchTerm}%`);
  }

  if (tagsFilter) {
    query = query.in("project_tag.tag.value", tagsFilter);
  }

  if (projectStatus) {
    query = query.eq("project_status.value", projectStatus);
  }

  if (businessTypeFilter) {
    query = query.eq("business.business_type.value", businessTypeFilter);
  }

  return query;
}

const getProjectByBusinessId = (client: SupabaseClient, businessIds: string[]) => {
  return client
    .from("project")
    .select(
      `
          id,
          project_name,
          business_id,
          published_time,
          card_image_url,
          project_short_description,
          ...project_investment_detail (
              min_investment,
              total_investment,
              target_investment
          )
      `
    )
    .in("business_id", businessIds);
};

export { getProjectData, getProjectDataQuery, getTopProjects, searchProjectsQuery, getProjectByBusinessId };
