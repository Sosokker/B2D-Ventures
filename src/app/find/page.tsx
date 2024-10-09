"use client";

import { useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProjectCard } from "@/components/projectCard";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusinesses, getInvestmentCounts, getProjects, getTags } from "@/lib/data/query";
import { Tables } from "@/types/database.types";

interface ProjectInvestmentDetail extends Tables<"ProjectInvestmentDetail"> {}

interface Project extends Tables<"Project"> {
  ProjectInvestmentDetail: ProjectInvestmentDetail[];
}

interface Business extends Tables<"Business"> {
  Projects: Project[];
}

export default function Find() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  //   const query = "neon";

  let supabase = createSupabaseClient();

  const {
    data: businesses,
    isLoading: isLoadingBusinesses,
    error: businessError,
  } = useQuery(getBusinesses(supabase, query));

  const businessIds = businesses?.map((b) => b.id) || [];
  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectError,
  } = useQuery(getProjects(supabase, businessIds), { enabled: businessIds.length > 0 });

  const projectIds = projects?.map((p) => p.id) || [];
  const {
    data: tags,
    isLoading: isLoadingTags,
    error: tagError,
  } = useQuery(getTags(supabase, projectIds), { enabled: projectIds.length > 0 });

  const {
    data: investmentCounts,
    isLoading: isLoadingInvestments,
    error: investmentError,
  } = useQuery(getInvestmentCounts(supabase, projectIds), { enabled: projectIds.length > 0 });

  // -----

  const isLoading = isLoadingBusinesses || isLoadingProjects || isLoadingTags || isLoadingInvestments;
  const error = businessError || projectError || tagError || investmentError;

  const results: Business[] =
    businesses?.map((business) => ({
      ...business,
      Projects:
        projects
          ?.filter((project) => project.businessId === business.id)
          .map((project) => ({
            ...project,
            tags: tags?.filter((tag) => tag.itemId === project.id).map((tag) => tag.Tag.value) || [],
            investmentCount: investmentCounts?.find((ic) => ic.projectId === project.id)?.count || 0,
          })) || [],
    })) || [];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div>
      <div className="mt-10 mx-[15%]">
        <h1 className="text-4xl font-bold">Result</h1>

        <Separator className="my-4" />

        {results.length === 0 && <p>No results found.</p>}
        {results.length > 0 && (
          <ul>
            {results.map((business) => (
              <li key={business.id}>
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>{business.businessName}</CardTitle>
                    <CardDescription>Joined Date: {new Date(business.joinedDate).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {business.Projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        name={project.projectName}
                        description={project.projectName}
                        joinDate={project.projectName}
                        location={"Bangkok"}
                        minInvestment={project.ProjectInvestmentDetail[0]?.minInvestment}
                        totalInvestor={project.ProjectInvestmentDetail[0]?.totalInvestment}
                        totalRaised={project.ProjectInvestmentDetail[0]?.targetInvestment}
                        tags={[]}
                      />
                    ))}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </div>
  );
}
