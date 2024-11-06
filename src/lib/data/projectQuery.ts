import { SupabaseClient } from "@supabase/supabase-js";
import { ProjectCardProps } from "@/types/ProjectCard";

async function getTopProjects(client: SupabaseClient, numberOfRecords: number = 4) {
  try {
    const { data, error } = await client
      .from("project_card")
      .select(
        `
          project_id,
          project_name,
          short_description,
          image_url,
          join_date,
          location,
          total_investor,
          total_raise,
          min_investment,
          tags
        `
      )
      .order("total_raise", { ascending: false })
      .limit(numberOfRecords);

    if (error) {
      return { data: null, error: error.message };
    }
    // console.log(data);
    return { data, error: null };
  } catch (err) {
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
      project_status_id,
      project_type_id,
      deadline,
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
      card_image_url,
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
      ...business (
        user_id
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
  tagFilter?: string;
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
    tagFilter,
    projectStatusFilter,
    businessTypeFilter,
    // sortByTimeFilter,
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
    project_status!inner (
      value
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
    ),
    investment_deal (
      deal_amount,
      investor_id
    )
    `
    )
    .range(start, end);

  // if (sortByTimeFilter && sortByTimeFilter !== "all") {
  //   query = query.eq("published_time", sortByTimeFilter);
  // }

  if (projectStatusFilter && projectStatusFilter !== "all") {
    query = query.eq("project_status.value", projectStatusFilter);
  }

  if (businessTypeFilter && businessTypeFilter !== "all") {
    query = query.eq("business.business_type.value", businessTypeFilter);
  }

  if (tagFilter && tagFilter !== "all") {
    query = query.in("tags.tag_name", [tagFilter]);
  }

  if (searchTerm) {
    query = query.ilike("project_name", `%${searchTerm}%`);
  }

  return query.order("published_time", { ascending: false });
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

const getProjectByUserId = (client: SupabaseClient, userId: string) => {
  return client
    .from("project")
    .select(
      `
      id,
      project_name,
      project_short_description,
      business_id:business!inner (
        user_id
      ),
      dataroom_id
    `
    )
    .eq("business.user_id", userId);
};

function getProjectByName(client: SupabaseClient, searchTerm: string) {
  return client
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
    .ilike("project_name", `%${searchTerm}%`);
}

const getProjectCardData = async (client: SupabaseClient, projectIds: string[]) => {
  const { data, error } = await client.from("project_card").select("*").in("project_id", projectIds);

  if (error) {
    return { data: null, error: error.message };
  }

  const projectSections = data.map((project) => {
    const projectSection: ProjectCardProps = {
      id: project.project_id,
      project_name: project.project_name,
      short_description: project.short_description,
      image_url: project.image_url,
      join_date: project.join_date,
      location: project.location,
      tags: project.tags || [],
      min_investment: project.min_investment,
      total_investor: project.total_investor,
      total_raise: project.total_raise,
    };
    return projectSection;
  });

  return { data: projectSections, error: null };
};
export {
  getProjectData,
  getProjectDataQuery,
  getTopProjects,
  searchProjectsQuery,
  getProjectByBusinessId,
  getProjectByUserId,
  getProjectByName,
  getProjectCardData,
};
