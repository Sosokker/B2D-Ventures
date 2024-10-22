"use client";

import { updateProfile } from "@/lib/data/profileMutate";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { profileSchema } from "@/types/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { uploadAvatar } from "@/lib/data/bucket/uploadAvatar";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function EditProfilePage({ params }: { params: { uid: string } }) {
  const uid = params.uid;
  const client = createSupabaseClient();
  const router = useRouter();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  const onProfileSubmit = async (updates: z.infer<typeof profileSchema>) => {
    const { avatars, username, full_name, bio } = updates;

    try {
      let avatarUrl = null;

      if (avatars instanceof File) {
        const avatarData = await uploadAvatar(client, avatars, uid);
        avatarUrl = avatarData?.path
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarData.path}`
          : null;
      }

      const result = await updateProfile(client, uid, {
        username,
        full_name,
        bio,
        ...(avatarUrl && { avatar_url: avatarUrl }),
      });

      if (result) {
        toast.success("Profile updated successfully!");
        router.push(`/profile/${uid}`);
      } else {
        toast.error("No fields to update!");
      }
    } catch (error) {
      toast.error("Error updating profile!");
      console.error("Error updating profile:", error);
    }
  };

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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your bio here" {...field} />
                  </FormControl>
                  <FormDescription>This is your public bio description.</FormDescription>
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
