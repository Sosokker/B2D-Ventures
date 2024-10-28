import React from "react";
import Image from "next/image";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getUserProfile } from "@/lib/data/userQuery";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default async function ProfilePage({ params }: { params: { uid: string } }) {
  const supabase = createSupabaseClient();
  const uid = params.uid;

  const { data: profileData, error } = await getUserProfile(supabase, uid);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading profile: {error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <div className="bg-card border-2 border-border shadow-xl rounded-lg overflow-hidden">
        <div className="bg-cover bg-center h-64 p-4" style={{ backgroundImage: "url(/banner.jpg)" }}>
          <div className="flex justify-end">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <Link href={`/profile/${uid}/edit`}>Edit Profile</Link>
            </button>
          </div>
        </div>
        <div className="px-4 py-2">
          {/* Upper */}
          <div className="flex flex-row items-center gap-4">
            {/* Profile Image */}
            <div className="text-center">
              <Image
                src={profileData.avatar_url || "https://via.placeholder.com/150"}
                alt={profileData.full_name || "Profile"}
                width={150}
                height={150}
                className="rounded-full border-4 border-white -mt-16 mx-auto sm:mx-0"
              />
            </div>
            {/* Name and Username */}
            <div className="flex-grow text-center sm:text-left mt-4 sm:mt-0">
              <h1 className="text-3xl font-bold">{profileData.full_name || "No Name"}</h1>
              <p className="text-gray-600">@{profileData.username || "username"}</p>
              {profileData.website && (
                <p className="text-blue-500 hover:text-blue-700">
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                    {profileData.website}
                  </a>
                </p>
              )}
            </div>
          </div>
          {/* Lower */}
          <div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Bio</h2>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{profileData.bio || "No bio available."}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 border-t">
          <p className="text-sm text-gray-600">
            Last updated: {profileData.updated_at ? format(new Date(profileData.updated_at), "PPpp") : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
