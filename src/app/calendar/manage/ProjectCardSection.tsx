"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ManageMeetDialog } from "./ManageMeetDialog";
import { Button } from "@/components/ui/button";

type ProjectCardSectionProps = {
  id: number;
  project_name: string;
  project_short_description: string;
  business_id: {
    user_id: string;
  };
  dataroom_id: number | null;
};

type ProjectCardCalendarManageSectionProps = {
  projectData: ProjectCardSectionProps[] | null;
};
export default function ProjectCardCalendarManageSection({ projectData }: ProjectCardCalendarManageSectionProps) {
  const [showMeetModal, setShowMeetModal] = useState<boolean>(false);
  const [currentProjectId, setCurrentProjectId] = useState<number | undefined>(undefined);

  return (
    <div id="content" className="grid grid-cols-2 space-x-2">
      {projectData != null ? (
        projectData.map((project) => (
          <Card key={project.id} className="mb-3">
            <CardHeader className="h-[55%]">
              <CardTitle>{project.project_name}</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CardDescription className="line-clamp-1">{project.project_short_description}</CardDescription>
                  </TooltipTrigger>
                  <TooltipContent>{project.project_short_description}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <Separator className="mb-3" />
            <CardContent>
              <Button
                onClick={() => {
                  setCurrentProjectId(project.id);
                  setTimeout(() => setShowMeetModal(true), 0);
                }}
              >
                Meeting List
              </Button>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        ))
      ) : (
        <div>No data</div>
      )}
      <ManageMeetDialog open={showMeetModal} onOpenChange={setShowMeetModal} projectId={currentProjectId!} />
    </div>
  );
}
