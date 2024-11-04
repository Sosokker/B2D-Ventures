import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadAvatar(
    supabase: SupabaseClient,
    file: File,
    uid: string,
) {
    const allowedExtensions = ["jpeg", "jpg", "png"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw new Error(
            "Invalid file format. Only jpeg, jpg, and png are allowed.",
        );
    }

    const fileName = `profile-${uid}.${fileExtension}`;

    const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
            upsert: true,
            contentType: `image/${fileExtension}`,
        });

    if (error) {
        throw error;
    }

    return data;
}
