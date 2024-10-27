import { SupabaseClient } from "@supabase/supabase-js";

export const getBusinessAndProject = (client: SupabaseClient, businessName: String | null) => {
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

  if (businessName && businessName.trim() !== "") {
    return query.ilike("business_name", `%${businessName}%`);
  }
  return query;
};
