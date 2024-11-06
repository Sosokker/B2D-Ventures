import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getUserProfile } from "@/lib/data/userQuery";
import { notFound } from "next/navigation";
import EditProfileForm from "./EditProfileForm";

type ProfilePageProps = {
  params: { uid: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const uid = params.uid;
  const client = createSupabaseClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user || user?.id !== uid) {
    notFound();
  }

  const { data: profileData, error } = await getUserProfile(client, uid);

  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Error loading profile data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl">
      <div className="my-5">
        <span className="text-2xl font-bold">Update Profile</span>
      </div>
      <EditProfileForm profileData={profileData} uid={uid} sessionUserId={user.id} />
    </div>
  );
}
