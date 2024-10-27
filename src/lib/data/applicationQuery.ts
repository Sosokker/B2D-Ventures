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
