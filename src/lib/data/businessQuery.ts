import { SupabaseClient } from "@supabase/supabase-js";

export const getAllBusinesses = (client: SupabaseClient) => {
  return client.from("business").select(`
      id,
      location,
      business_name,
      ...business_type (
        business_type:value
      ),
      joined_date,
      ...user_id (
        user_id:id,
        username,
        full_name,
        email
      )
    `);
};

export const getBusinessByName = (
  client: SupabaseClient,
  params: { businessName?: string | null; single?: boolean } = { single: false }
) => {
  const query = client.from("business").select(`
      business_id:id,
      location,
      business_name,
      ...business_type (
        business_type_id: id,
        business_type: value
      ),
      joined_date,
      user_id
    `);

  if (params.businessName && params.businessName.trim() !== "") {
    query.ilike("business_name", `%${params.businessName}%`);
  }

  if (params.single) {
    query.single();
  }

  return query;
};

export const getBusinessByUserId = (client: SupabaseClient, userId: string) => {
  const query = client
    .from("business")
    .select(
      `
    business_id:id,
    location,
    business_name,
    ...business_type (
      business_type_id: id,
      business_type: value
    ),
    joined_date,
    user_id
  `
    )
    .eq("user_id", userId)
    .single();

  return query;
};

export const getBusinessAndProject = (
  client: SupabaseClient,
  params: { businessName?: String | null; businessId?: number | null; single?: boolean } = { single: false }
) => {
  const query = client.from("business").select(`
      business_id:id,
      location,
      business_name,
      business_type:business_type (
        business_type_id:id,
        value
      ),
      joined_date,
      user_id,
      projects:project (
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
        ),
        tags:project_tag (
          ...tag (
            tag_value:value
          )
        )
      )
    `);

  if (params.businessName && params.businessName.trim() !== "") {
    return query.or(`business_name.ilike.%${params.businessName}%,project_name.ilike.%${params.businessName}%`);
  }

  if (params.businessId) {
    query.eq("id", params.businessId);
  }

  if (params.single) {
    query.single();
  }

  return query;
};
