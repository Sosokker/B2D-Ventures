import { SupabaseClient } from "@supabase/supabase-js";


function getAllTagsQuery(client: SupabaseClient) {
  return client.from("Tag").select("id, value");
}

function getALlFundedStatusQuery(client: SupabaseClient) {
  return client.from("FundedStatus").select("id, value, description");
}

function getAllBusinessTypeQuery(client: SupabaseClient) {
  return client.from("BusinessType").select("id, value, description");
}

export { getAllTagsQuery, getALlFundedStatusQuery, getAllBusinessTypeQuery };