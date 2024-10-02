"use client";

import { useSearchParams } from "next/navigation";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ProjectInvestmentDetail {
  minInvestment: number;
  totalInvestment: number;
  targetInvestment: number;
}

interface Project {
  id: string;
  projectName: string;
  businessId: string;
  investmentCount: number;
  ProjectInvestmentDetail: ProjectInvestmentDetail[];
  tags: string[];
}

interface Business {
  id: string;
  businessName: string;
  joinedDate: string;
  Projects: Project[];
}

function getBusinesses(client: SupabaseClient, query: string | null) {
  return client.from("Business").select("id, businessName, joinedDate").ilike("businessName", `%${query}%`);
}

function getProjects(client: SupabaseClient, businessIds: string[]) {
  return client
    .from("Project")
    .select(
      `
            id,
            projectName,
            businessId,
            ProjectInvestmentDetail (
                minInvestment,
                totalInvestment,
                targetInvestment
            )
        `
    )
    .in("businessId", businessIds);
}

function getTags(client: SupabaseClient, projectIds: string[]) {
  return client.from("ItemTag").select("itemId, Tag (value)").in("itemId", projectIds);
}

function getInvestmentCounts(client: SupabaseClient, projectIds: string[]) {
  return client.from("InvestmentDeal").select("*", { count: "exact", head: true }).in("projectId", projectIds);
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
      {results.length === 0 && <p>No results found.</p>}
      {results.length > 0 && (
        <ul>
          {results.map((business) => (
            <li key={business.id}>
              <h2>{business.businessName}</h2>
              <p>Joined Date: {new Date(business.joinedDate).toLocaleDateString()}</p>
              <ul>
                {business.Projects.map((project) => (
                  <li key={project.id}>
                    <h3>{project.projectName}</h3>
                    <p>Investment Count: {project.investmentCount}</p>
                    <p>Min Investment: ${project.ProjectInvestmentDetail[0]?.minInvestment}</p>
                    <p>Total Investment: ${project.ProjectInvestmentDetail[0]?.totalInvestment}</p>
                    <p>Target Investment: ${project.ProjectInvestmentDetail[0]?.targetInvestment}</p>
                    <p>Tags: {project.tags.join(", ")}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}
