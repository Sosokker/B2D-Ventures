import { SupabaseClient } from "@supabase/supabase-js";

function getAllTagsQuery(client: SupabaseClient) {
  return client.from("tag").select("id, value");
}

function getALlFundedStatusQuery(client: SupabaseClient) {
  return client.from("funded_status").select("id, value, description");
}

function getAllBusinessTypeQuery(client: SupabaseClient) {
  return client.from("business_type").select("id, value, description");
}

export { getAllBusinessTypeQuery, getALlFundedStatusQuery, getAllTagsQuery };
