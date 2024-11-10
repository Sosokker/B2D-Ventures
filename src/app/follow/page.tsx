import { ProjectSection } from "@/components/ProjectSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProjectCardData } from "@/lib/data/projectQuery";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getFollowByUserId } from "@/lib/data/followQuery";

export default async function FollowPage() {
  const supabase = createSupabaseClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(userError?.message || "Unknown error");
  }

  const { data: followsProjects, error: followsProjectsError } = await getFollowByUserId(supabase, user!.user.id);

  if (followsProjectsError) {
    throw new Error(followsProjectsError.message || "Unknown error");
  }

  const projectIdList: string[] = followsProjects.map((follow) => follow.project_id);

  const { data: projectsData, error: projectsDataError } = await getProjectCardData(supabase, projectIdList);

  if (projectsDataError) {
    throw new Error(projectsDataError || "Unknown error");
  }

  return (
    <div className="container max-w-screen-xl my-5">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Your favorite projects</CardTitle>
            <CardDescription>Found {projectsData?.length ?? 0} projects!</CardDescription>
          </CardHeader>
          <Separator className="my-3" />
          <CardContent>
            <ProjectSection projectsData={projectsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
