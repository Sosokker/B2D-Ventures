import React from "react";
import { ProjectCard } from "@/components/projectCard";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCardProps } from "@/types/ProjectCard";
import Link from "next/link";

export function ProjectSection({ projectsData }: { projectsData: ProjectCardProps[] | null }) {
  if (!projectsData || projectsData.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Project Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sorry, we could not find any projects matching your search criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div id="project-card">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Found {projectsData.length} projects!</CardDescription>
          </CardHeader>
          <Separator className="my-3" />
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsData.map((project) => (
                <div key={project.id}>
                  <Link href={`/deals/${project.id}`}>
                    <ProjectCard
                      name={project.project_name}
                      description={project.short_description}
                      imageUri={project.image_url}
                      joinDate={new Date(project.join_date).toLocaleDateString()}
                      location={project.location}
                      tags={project.tags}
                      minInvestment={project.min_investment}
                      totalInvestor={project.total_investor}
                      totalRaised={project.total_raise}
                    />
                  </Link>
                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
