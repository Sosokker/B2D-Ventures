import React, { Suspense } from "react";
import EditProjectForm from "./EditProjectForm";
import { Separator } from "@/components/ui/separator";
import { getProjectDataQuery } from "@/lib/data/projectQuery";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { ProjectEditSchema } from "@/types/schemas/project.schema";
import { redirect } from "next/navigation";
import { LegacyLoader } from "@/components/loading/LegacyLoader";

export default async function EditProjectPage({ params }: { params: { projectId: string } }) {
  const client = createSupabaseClient();
  const projectId = Number(params.projectId);

  // Check permission
  const { data: user, error: userError } = await client.auth.getUser();
  const uuid = user.user?.id;
  const { data, error } = await client.from("project").select("...business(user_id)").eq("id", projectId).single();

  if (userError || error) {
    redirect("/");
  }

  if (data.user_id != uuid || data == null) {
    redirect("/");
  }

  const { data: projectData, error: projectDataError } = await getProjectDataQuery(client, projectId);

  if (projectDataError) {
    console.error("Error fetching project data:", projectDataError);
    throw projectDataError;
  }

  const mappedProjectData: ProjectEditSchema = {
    project_name: projectData.project_name,
    project_status_id: projectData.project_status_id,
    project_type_id: projectData.project_type_id,
    project_short_description: projectData.project_short_description,
    project_description: projectData.project_description,
    deadline: projectData.deadline ? new Date(projectData.deadline).toISOString() : undefined,
  };

  return (
    <div className="container max-w-screen-xl">
      <div className="my-5">
        <span className="text-2xl font-bold">Edit Project</span>
        <Separator className="my-5" />
      </div>
      <Suspense fallback={<LegacyLoader />}>
        {projectData ? <EditProjectForm projectData={mappedProjectData} projectId={projectId} /> : <LegacyLoader />}
      </Suspense>
    </div>
  );
}
