import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getProjectByUserId } from "@/lib/data/projectQuery";
import { Suspense } from "react";
import { LegacyLoader } from "@/components/loading/LegacyLoader";
import { getUserRole } from "@/lib/data/userQuery";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProjectCardCalendarManageSection from "./ProjectCardSection";

export default async function ManageMeetingPage() {
  const supabase = createSupabaseClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw "Can't get user data!";
  }

  const userId = user.user?.id;

  const { data: roleData, error: roleDataError } = await getUserRole(supabase, userId);

  if (roleDataError) {
    throw "Error fetching user data";
  }

  if (!roleData || roleData.role != "business") {
    return (
      <div className="container max-w-screen-xl">
        <span className="flex gap-2 items-center mt-4">
          <Clock />
          <p className="text-2xl font-bold">Manage Meeting Request</p>
        </span>
        <Separator className="my-3" />
        <div className="mb-3 mt-2">Please apply for business first to access functionalities of busienss account</div>
        <Link href="/business/apply">
          <Button>Apply for business</Button>
        </Link>
      </div>
    );
  }

  const { data: projectData, error: projectDataError } = await getProjectByUserId(supabase, userId);

  if (projectDataError) {
    throw "Can't get project data";
  }

  return (
    <div className="container max-w-screen-xl">
      <span className="flex gap-2 items-center mt-4">
        <Clock />
        <p className="text-2xl font-bold">Manage Meeting Request</p>
      </span>
      <Separator className="my-3" />
      <Suspense fallback={<LegacyLoader />}>
        <ProjectCardCalendarManageSection projectData={projectData} />
      </Suspense>
    </div>
  );
}
