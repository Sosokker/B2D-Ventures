"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { ProjectCard } from "@/components/projectCard";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusinessAndProject } from "@/lib/data/businessQuery";

function FindContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  let supabase = createSupabaseClient();

  const {
    data: businesses,
    isLoading: isLoadingBusinesses,
    error: businessError,
  } = useQuery(getBusinessAndProject(supabase, query));

  const isLoading = isLoadingBusinesses;
  const error = businessError;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className="container max-w-screen-xl">
      <div className="mt-4">
        <h1 className="text-4xl font-bold">Result</h1>

        <Separator className="my-4" />

        <Card className="w-full">
          <CardContent className="my-2">
            {businesses!.length === 0 && <p>No results found.</p>}
            {businesses!.length > 0 && (
              <ul>
                {businesses!.map((business) => (
                  <li key={business.business_id}>
                    <Card className="w-full">
                      <CardHeader>
                        <CardTitle>{business.business_name}</CardTitle>
                        <CardDescription>
                          Joined Date: {new Date(business.joined_date).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-4 gap-4">
                        {business?.projects && business.projects.length > 0 ? (
                          business.projects.map((project) => (
                            <ProjectCard
                              key={project.id}
                              name={project.project_name}
                              description={project.project_short_description}
                              joinDate={project.published_time}
                              location={business.location}
                              minInvestment={project.min_investment}
                              totalInvestor={project.total_investment}
                              totalRaised={project.target_investment}
                              tags={project.tags?.map((tag) => String(tag.tag_value)) || []}
                              imageUri={project.card_image_url}
                            />
                          ))
                        ) : (
                          <p>No Projects</p>
                        )}
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Find() {
  return (
    <Suspense fallback={<p>Loading search parameters...</p>}>
      <FindContent />
    </Suspense>
  );
}
