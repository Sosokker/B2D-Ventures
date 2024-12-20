import React, { Suspense } from "react";
import { getBusinessByName } from "@/lib/data/businessQuery";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { BusinessSection } from "./BusinessSection";
import { ProjectSection } from "@/components/ProjectSection";
import { getProjectCardData } from "@/lib/data/projectQuery";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FindContent({ searchParams }: { searchParams: { query: string } }) {
  const query = searchParams.query;

  const supabase = createSupabaseClient();

  const { data: projectIds, error: projectIdsError } = await supabase
    .from("project")
    .select(`id`)
    .ilike("project_name", `%${query}%`);

  const { data: businessData, error: businessDataError } = await getBusinessByName(supabase, { businessName: query });

  if (businessDataError || projectIdsError) {
    throw new Error(businessDataError?.message || projectIdsError?.message || "Unknown error");
  }

  const projectIdList: string[] = projectIds.map((item) => item.id);
  const { data: projectsData, error: projectsDataError } = await getProjectCardData(supabase, projectIdList);

  if (projectsDataError) {
    throw new Error(projectsDataError || "Unknown error");
  }

  return (
    <div className="container max-w-screen-xl my-5 space-y-5">
      <Suspense fallback={<div>Loading Business and Projects...</div>}>
        <BusinessSection businessData={businessData} />
      </Suspense>
      <Separator className="my-3" />
      <Suspense fallback={<div>Loading Projects...</div>}>
        <div className="space-y-6">
          <div id="project-card">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Found {projectsData?.length ?? 0} projects!</CardDescription>
              </CardHeader>
              <Separator className="my-3" />
              <CardContent>
                <ProjectSection projectsData={projectsData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
