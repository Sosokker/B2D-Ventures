"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Clock3Icon, UserIcon, UsersIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getAllBusinessTypeQuery, getAllTagsQuery, getAllProjectStatusQuery } from "@/lib/data/dropdownQuery";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { searchProjectsQuery, FilterParams, FilterProjectQueryParams } from "@/lib/data/projectQuery";
import { Input } from "@/components/ui/input";
import { ProjectSection } from "@/components/ProjectSection";
import { ShowFilter } from "./ShowFilter";
import { Button } from "@/components/ui/button";

export default function Deals() {
  const supabase = createSupabaseClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermVisual, setSearchTermVisual] = useState(""); // For the input field
  // const [sortByTimeFilter, setSortByTimeFilter] = useState("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const filterParams: FilterParams = {
    searchTerm,
    tagFilter,
    projectStatusFilter,
    businessTypeFilter,
    // sortByTimeFilter,
  };

  let filterProjectQueryParams: FilterProjectQueryParams = {
    searchTerm,
    tagFilter,
    projectStatusFilter,
    businessTypeFilter,
    // sortByTimeFilter,
    page,
    pageSize,
  };

  const { data: tagData, isLoading: isLoadingTag, error: isTagError } = useQuery(getAllTagsQuery(supabase));
  const {
    data: projectStatusData,
    isLoading: isLoadingprojectStatus,
    error: isprojectStatusError,
  } = useQuery(getAllProjectStatusQuery(supabase));
  const {
    data: businessType,
    isLoading: isLoadingBusinessType,
    error: businessTypeLoadingError,
  } = useQuery(getAllBusinessTypeQuery(supabase));
  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsLoadingError,
    refetch,
  } = useQuery(searchProjectsQuery(supabase, filterProjectQueryParams));

  const formattedProjects =
    projects?.map((project) => ({
      id: project.project_id,
      project_name: project.project_name,
      short_description: project.project_short_description,
      image_url: project.card_image_url,
      join_date: new Date(project.published_time).toLocaleDateString(),
      location: project.business_location,
      tags: project.tags.map((tag) => tag.tag_name),
      min_investment: project.min_investment || 0,
      total_investor: project.total_investment || 0,
      total_raise: project.total_investment || 0,
    })) || [];

  const clearAll = () => {
    setSearchTerm("");
    setSearchTermVisual("");
    setTagFilter("all");
    setProjectStatusFilter("all");
    setBusinessTypeFilter("all");
    // setSortByTimeFilter("all");
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const handleSearchClick = () => {
    setSearchTerm(searchTermVisual);
    refetch();
  };

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="h-auto mt-10">
        <h1 className="text-4xl font-bold">Investment Opportunities</h1>
        <br />
        <p>Browse current investment opportunities on B2DVenture.</p>
        <p>
          All companies are <u>vetted & pass due diligence.</u>
        </p>

        {/* Search Input and Filters */}
        <div className="flex mt-10 gap-3">
          <Input
            type="text"
            placeholder="Search projects"
            value={searchTermVisual}
            onChange={(e) => setSearchTermVisual(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
          />

          <Button variant="outline" onClick={handleSearchClick}>
            Search
          </Button>

          {/* Posted At Filter */}
          {/* <Select value={sortByTimeFilter} onValueChange={(value) => setSortByTimeFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Clock3Icon className="ml-2" />
              <SelectValue placeholder="Posted at" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
            </SelectContent>
          </Select> */}

          {/* Business Type Filter */}
          <Select value={businessTypeFilter} onValueChange={(value) => setBusinessTypeFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <UsersIcon className="ml-2" />
              <SelectValue placeholder="Business Type" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingBusinessType ? (
                <SelectItem disabled value="_">
                  Loading...
                </SelectItem>
              ) : businessTypeLoadingError ? (
                <SelectItem disabled value="_">
                  No data available
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="all">All Types</SelectItem>
                  {businessType &&
                    businessType.map((type) => (
                      <SelectItem key={type.id} value={type.value}>
                        {type.value}
                      </SelectItem>
                    ))}
                </>
              )}
            </SelectContent>
          </Select>

          {/* Project Status Filter */}
          <Select value={projectStatusFilter} onValueChange={(value) => setProjectStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <UserIcon className="ml-2" />
              <SelectValue placeholder="Project Status" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingprojectStatus ? (
                <SelectItem disabled value="_">
                  Loading...
                </SelectItem>
              ) : isprojectStatusError ? (
                <SelectItem disabled value="_">
                  No data available
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {projectStatusData &&
                    projectStatusData.map((status) => (
                      <SelectItem key={status.id} value={status.value}>
                        {status.value}
                      </SelectItem>
                    ))}
                </>
              )}
            </SelectContent>
          </Select>

          {/* Tags Filter */}
          <Select value={tagFilter} onValueChange={(value) => setTagFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <UserIcon className="ml-2" />
              <SelectValue placeholder="Tags" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingTag ? (
                <SelectItem disabled value="_">
                  Loading...
                </SelectItem>
              ) : isTagError ? (
                <SelectItem disabled value="_">
                  No data available
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tagData &&
                    tagData.map((tag) => (
                      <SelectItem key={tag.id} value={tag.value}>
                        {tag.value}
                      </SelectItem>
                    ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        <Separator className="mt-4 bg-background" />
        <ShowFilter filterParams={filterParams} clearAll={clearAll} />
        <Separator className="my-3" />

        {/* Project Cards Section */}
        {isLoadingProjects ? (
          <div>Loading...</div>
        ) : projectsLoadingError ? (
          <div>Error loading projects</div>
        ) : (
          <div>
            <ProjectSection projectsData={formattedProjects} />
          </div>
        )}
        {/* Pagination Controls */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span>Page Size:</span>
            <Select onValueChange={(value) => handlePageSizeChange(Number(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="16">16</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={() => setPage((prevPage) => prevPage + 1)}
            disabled={projects! && projects.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
