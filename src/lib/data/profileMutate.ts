import { SupabaseClient } from "@supabase/supabase-js";

interface UpdateData {
    username?: string;
    full_name?: string;
    bio?: string;
    updated_at?: Date;
}

export async function updateProfile(
    supabase: SupabaseClient,
    userId: string,
    updates: UpdateData,
) {
    const updateData: { [key: string]: any | undefined } = {};

    if (updates.username || updates.username != "") {
        updateData.username = updates.username;
    }
    if (updates.full_name || updates.full_name != "") {
        updateData.full_name = updates.full_name;
    }
    if (updates.bio || updates.bio != "") {
        updateData.bio = updates.bio;
    }

    updateData.updated_at = new Date();

    if (
        updateData.username != undefined || updateData.full_name != undefined ||
        updateData.bio != undefined
    ) {
        const { error } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", userId);

        if (error) {
            console.error("Error updating profile:", error);
            throw error;
        }

        return true;
    } else {
        console.log("No fields to update.");
        return null;
    }
}
