"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { profileSchema } from "@/types/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadAvatar } from "@/lib/data/bucket/uploadAvatar";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdxEditor } from "@/components/MarkdownEditor";
import { updateProfile } from "@/lib/data/profileMutate";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useState } from "react";

interface ProfileData {
  username: string;
  full_name: string;
  bio: string;
}

type EditProfileFormProps = {
  profileData: ProfileData;
  uid: string;
  sessionUserId: string;
};

export default function EditProfileForm({ profileData, uid, sessionUserId }: EditProfileFormProps) {
  const router = useRouter();
  const client = createSupabaseClient();
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatars: undefined,
      username: profileData?.username || "",
      full_name: profileData?.full_name || "",
      bio: profileData?.bio || "",
    },
  });

  const [bioContent, setBioContent] = useState<string>(profileData.bio || "");

  const onProfileSubmit = async (updates: z.infer<typeof profileSchema>) => {
    const { avatars, username, full_name } = updates;
    let avatarUrl = null;

    try {
      if (avatars instanceof File) {
        const avatarData = await uploadAvatar(client, avatars, uid);
        avatarUrl = avatarData?.path
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarData.path}`
          : null;
      }

      const updateData = {
        username,
        full_name,
        bio: bioContent,
        ...(avatarUrl && { avatar_url: avatarUrl }),
      };

      const hasChanges = Object.values(updateData).some((value) => value !== undefined && value !== null);

      if (!hasChanges) {
        toast.error("No fields to update!");
        return;
      }

      const result = await updateProfile(client, uid, updateData);

      if (result) {
        toast.success("Profile updated successfully!");
        router.push(`/profile/${uid}`);
        router.refresh();
      } else {
        toast.error("Failed to update profile!");
      }
    } catch (error) {
      toast.error("Error updating profile!");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
          <FormField
            control={profileForm.control}
            name="avatars"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    onChange={(event) => onChange(event.target.files && event.target.files[0])}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>This is your public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>This is your public full name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="bio"
            render={() => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <MdxEditor content={bioContent} setContentInParent={setBioContent} />
                </FormControl>
                <FormDescription>This is your public bio description in Markdown format.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
