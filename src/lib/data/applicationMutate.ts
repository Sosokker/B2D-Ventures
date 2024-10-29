import { SupabaseClient } from "@supabase/supabase-js";

export async function rejectBusiness(client: SupabaseClient, businessApplicationId: Number) {
  return client
    .from("business_application")
    .update({
      status: "reject",
    })
    .eq("id", businessApplicationId);
}

export async function approveBusiness(client: SupabaseClient, businessApplicationId: Number) {
  return client
    .from("business_application")
    .update({
      status: "approve",
    })
    .eq("id", businessApplicationId);
}

export async function rejectProject(client: SupabaseClient, projectApplicationId: Number) {
  return client
    .from("project_application")
    .update({
      status: "reject",
    })
    .eq("id", projectApplicationId);
}

export async function approveProject(client: SupabaseClient, projectApplicationId: Number) {
  return client
    .from("project_application")
    .update({
      status: "approve",
    })
    .eq("id", projectApplicationId);
}
