"use client";

import { updateProfile } from "@/lib/data/profileMutate";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { profileSchema } from "@/types/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { uploadAvatar } from "@/lib/data/bucket/uploadAvatar";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import useSession from "@/lib/supabase/useSession";
import React, { useState } from "react";
import { MdxEditor } from "@/components/MarkdownEditor";

export default function EditProfilePage({ params }: { params: { uid: string } }) {
  const uid = params.uid;
  const client = createSupabaseClient();
  const router = useRouter();
  const { session, loading: isLoadingSession } = useSession();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  const [bioContent, setBioContent] = useState<string>("");

  if (isLoadingSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  const onProfileSubmit = async (updates: z.infer<typeof profileSchema>) => {
    const { avatars, username, full_name } = updates;
    let avatarUrl = null;

    try {
      if (avatars instanceof File) {
        const { data: currentProfile, error: fetchError } = await client
          .from("profiles")
          .select("avatar_url")
          .eq("id", uid)
          .single();

        if (fetchError) {
          throw new Error("Failed to fetch existing profile data");
        }

        if (currentProfile?.avatar_url) {
          const oldAvatarPath = currentProfile.avatar_url.split("/").pop();
          const { error: deleteError } = await client.storage.from("avatars").remove([oldAvatarPath]);

          if (deleteError) {
            console.warn("Failed to delete old avatar:", deleteError.message);
          }
        }

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
      } else {
        toast.error("Failed to update profile!");
      }
    } catch (error) {
      toast.error("Error updating profile!");
      console.error("Error updating profile:", error);
    }
  };

  if (uid != session?.user.id) {
    router.push(`/profile/${uid}`);
  }

  return (
    <div className="container max-w-screen-xl">
      <div className="my-5">
        <span className="text-2xl font-bold">Update Profile</span>
        <Separator className="my-5" />
      </div>
      <div>
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
            <FormField
              control={profileForm.control}
              name="avatars"
              // eslint-disable-next-line no-unused-vars
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
    </div>
  );
}
