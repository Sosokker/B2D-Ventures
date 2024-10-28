"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Clock3Icon, UserIcon, UsersIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProjectCard } from "@/components/projectCard";
import { getALlFundedStatusQuery, getAllBusinessTypeQuery } from "@/lib/data/dropdownQuery";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { searchProjectsQuery, FilterParams, FilterProjectQueryParams } from "@/lib/data/projectQuery";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Project {
  project_id: string;
  project_name: string;
  published_time: string;
  project_short_description: string;
  card_image_url: string;
  project_status: {
    value: string;
  };
  min_investment: number;
  total_investment: number;
  target_investment: number;
  investment_deadline: string;
  tags: {
    tag_name: string;
  }[];
  business_type: {
    value: string;
  };
  business_location: string;
}

const ProjectSection = ({ filteredProjects }: { filteredProjects: Project[] }) => {
  interface Tags {
    tag_name: string;
  }

  if (!filteredProjects) {
    return <div>No projects found!</div>;
  }

  return (
    <div>
      <div className="mt-10">
        <h2 className="text-2xl">Deals</h2>
        <p className="mt-3">The deals attracting the most interest right now</p>
      </div>

      {/* Block for all the deals */}
      <div className="mt-10 grid grid-cols-3 gap-4">
        {filteredProjects.map((item, index) => (
          <Link key={index} href={`/deals/${item.project_id}`}>
            <ProjectCard
              key={index}
              name={item.project_name}
              description={item.project_short_description}
              joinDate={item.published_time}
              imageUri={item.card_image_url}
              location={item.business_location}
              minInvestment={item.min_investment}
              totalInvestor={item.total_investment}
              totalRaised={item.target_investment}
              tags={item.tags.map((tag: Tags) => tag.tag_name)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

const ShowFilter = ({ filterParams, clearAll }: { filterParams: FilterParams; clearAll: () => void }) => {
  const { searchTerm, tagsFilter, projectStatusFilter, businessTypeFilter, sortByTimeFilter } = filterParams;

  if (!searchTerm && !tagsFilter && !projectStatusFilter && !businessTypeFilter && !sortByTimeFilter) {
    return <div></div>;
  }

  if (
    projectStatusFilter === "all" &&
    businessTypeFilter === "all" &&
    sortByTimeFilter === "all" &&
    (!tagsFilter || tagsFilter.length === 0)
  ) {
    return <div></div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {searchTerm && (
        <Button key={searchTerm} variant="secondary">
          {searchTerm}
        </Button>
      )}

      {tagsFilter &&
        tagsFilter.map((tag: string) => (
          <Button key={tag} variant="secondary">
            {tag}
          </Button>
        ))}

      {projectStatusFilter && projectStatusFilter !== "all" && (
        <Button key={projectStatusFilter} variant="secondary">
          {projectStatusFilter}
        </Button>
      )}

      {businessTypeFilter && businessTypeFilter !== "all" && (
        <Button key={businessTypeFilter} variant="secondary">
          {businessTypeFilter}
        </Button>
      )}

      {sortByTimeFilter && sortByTimeFilter !== "all" && (
        <Button key={sortByTimeFilter} variant="secondary">
          {sortByTimeFilter}
        </Button>
      )}

      {/* Clear All button */}
      <Button variant="destructive" onClick={clearAll}>
        Clear All
      </Button>
    </div>
  );
};

export default function Deals() {
  const supabase = createSupabaseClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermVisual, setSearchTermVisual] = useState("");
  const [sortByTimeFilter, setSortByTimeFilter] = useState("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState([]);
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const filterParams: FilterParams = {
    searchTerm,
    tagsFilter: tagFilter,
    projectStatusFilter,
    businessTypeFilter,
    sortByTimeFilter,
  };

  const filterProjectQueryParams: FilterProjectQueryParams = {
    searchTerm,
    tagsFilter: tagFilter,
    projectStatusFilter,
    businessTypeFilter,
    sortByTimeFilter,
    page,
    pageSize,
  };

  const {
    data: projectStatus,
    isLoading: isLoadingFunded,
    error: fundedLoadingError,
  } = useQuery(getALlFundedStatusQuery(supabase));
  const {
    data: businessType,
    isLoading: isLoadingBusinessType,
    error: businessTypeLoadingError,
  } = useQuery(getAllBusinessTypeQuery(supabase));

  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsLoadingError,
  } = useQuery(searchProjectsQuery(supabase, filterProjectQueryParams));

  const clearAll = () => {
    setSearchTerm("");
    setTagFilter([]);
    setProjectStatusFilter("all");
    setBusinessTypeFilter("all");
    setSortByTimeFilter("all");
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  useEffect(() => {
    setSearchTerm(searchTermVisual);
  }, [searchTermVisual]);

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
                setSearchTerm(e.currentTarget.value);
              }
            }}
          />

          {/* Posted At Filter */}
          <Select onValueChange={(value) => setSortByTimeFilter(value)}>
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
          </Select>

          {/* Business Type Filter */}
          <Select onValueChange={(value) => setBusinessTypeFilter(value)}>
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
          <Select onValueChange={(key) => setProjectStatusFilter(key)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <UserIcon className="ml-2" />
              <SelectValue placeholder="Project Status" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingFunded ? (
                <SelectItem disabled value="_">
                  Loading...
                </SelectItem>
              ) : fundedLoadingError ? (
                <SelectItem disabled value="_">
                  No data available
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {projectStatus &&
                    projectStatus.map((status) => (
                      <SelectItem key={status.id} value={status.value}>
                        {status.value}
                      </SelectItem>
                    ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        <ShowFilter filterParams={filterParams} clearAll={clearAll} />
        <Separator className="mt-10" />

        {/* Project Cards Section */}
        {isLoadingProjects ? (
          <div>Loading...</div>
        ) : projectsLoadingError ? (
          <div>Error loading projects.</div>
        ) : projects ? (
          <ProjectSection filteredProjects={projects} />
        ) : (
          <div>No projects found!</div>
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
