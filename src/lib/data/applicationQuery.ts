import { SupabaseClient } from "@supabase/supabase-js";

export const getAllBusinessApplicationQuery = (client: SupabaseClient) => {
  return client.from("business_application").select(
    `
        id,
        ...user_id!inner (
            user_id:id,
            username
        ),
        ...business_type_id!inner (
            business_type_id:id,
            business_type_value:value
        ),
        project_application_id,
        business_name,
        created_at,
        is_in_us,
        is_for_sale,
        pitch_deck_url,
        community_size,
        is_generating_revenue,
        money_raised_to_date,
        location,
        status
        `
  );
};

export const getAllProjectApplicationByBusinessQuery = (client: SupabaseClient, businessId: number) => {
  return client
    .from("project_application")
    .select(
      `
      id,
      created_at,
      deadline,
      status,
      project_name,
      ...business_id (
        business_id:id,
        business_name,
        user_id
      ),
      ...project_type_id!inner (
        project_type_id:id,
        project_type_value:value
      ),
      short_description,
      pitch_deck_url,
      project_logo,
      min_investment,
      target_investment,
      user_id,
      project_photos
    `
    )
    .eq("business_id", businessId);
};
