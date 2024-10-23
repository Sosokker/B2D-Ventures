import { SupabaseClient } from "@supabase/supabase-js";

export async function rejectBusiness(
    client: SupabaseClient,
    businessApplicationId: Number,
) {
    return client.from("business_application")
        .update({
            status: "reject",
        })
        .eq("id", businessApplicationId);
}

export async function approveBusiness(
    client: SupabaseClient,
    businessApplicationId: Number,
) {
    return client.from("business_application")
        .update({
            status: "approve",
        })
        .eq("id", businessApplicationId);
}
