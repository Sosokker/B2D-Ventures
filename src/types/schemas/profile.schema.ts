import { z } from "zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const profileAvatarSchema = z
    .custom<File>(
        (val) =>
            val && typeof val === "object" && "size" in val && "type" in val,
        {
            message: "Input must be a file.",
        },
    )
    .refine((file) => file.size < MAX_FILE_SIZE, {
        message: "File can't be bigger than 5MB.",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "File format must be either jpg, jpeg, or png.",
    }).optional();

export const profileSchema = z.object({
    username: z.string().min(3).max(50).optional(),
    full_name: z.string().min(4).max(100).optional(),
    bio: z.string().min(10).max(1000).optional(),
    updated_at: z.string().datetime().optional(),
    avatars: profileAvatarSchema,
});
