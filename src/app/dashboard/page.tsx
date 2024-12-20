"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/ui/overview";
import { RecentFunds } from "@/components/recent-funds";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import useSession from "@/lib/supabase/useSession";
import { getProjectByUserId } from "@/lib/data/projectQuery";
// import { Loader } from "@/components/loading/loader";
import { getInvestmentByProjectsIds } from "@/lib/data/investmentQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { overAllGraphData, fourYearGraphData, dayOftheWeekData } from "../portfolio/[uid]/query";
import CountUp from "react-countup";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
import { LegacyLoader } from "@/components/loading/LegacyLoader";

export default function Dashboard() {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const { session, loading: isLoadingSession } = useSession();
  const userId = session?.user.id;
  const [projects, setProjects] = useState<
    {
      id: number;
      project_name: string;
      project_short_description: string;
      business_id: { user_id: string };
      dataroom_id: number | null;
    }[]
  >([]);
  const [latestInvestment, setLatestInvestment] = useState<
    {
      avatarUrl: string;
      createdTime: Date;
      dealAmount: number;
      dealStatus: string;
      investorId: string;
      username: string;
    }[]
  >([]);
  const tabOptions = ["daily", "monthly", "yearly"];
  const [activeTab, setActiveTab] = useState("daily");
  const [graphType, setGraphType] = useState("line");
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [currentProjectId, setCurrentProjectId] = useState<number>(projects[0]?.id);

  const investmentDetail = useQuery(
    getInvestmentByProjectsIds(
      supabase,
      projects.map((item) => {
        return item.id.toString();
      })
    )
  );
  let graphData = [];
  const filteredProject = (investmentDetail?.data || []).filter((deal) => deal.project_id === currentProjectId);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (activeTab === "daily") {
    graphData = dayOftheWeekData(filteredProject);
  } else if (activeTab === "yearly") {
    graphData = fourYearGraphData(filteredProject);
  } else {
    graphData = overAllGraphData(filteredProject);
  }

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userId) return;
      const { data, error } = await getProjectByUserId(supabase, userId);
      if (error) console.error("Error fetching projects");
      setProjects(data || []);
      setIsLoadingProjects(false);
    };
    fetchProjects();
  }, [supabase, userId]);

  useEffect(() => {
    if (projects.length > 0 && !currentProjectId) {
      setCurrentProjectId(projects[0].id);
    }
  }, [projects, currentProjectId]);

  useEffect(() => {
    const setTopLatestInvestment = () => {
      if (investmentDetail?.data) {
        setLatestInvestment(
          investmentDetail.data
            .slice(0, 8)
            .map((item) => {
              if (item.project_id === currentProjectId) {
                return {
                  avatarUrl: item.avatar_url,
                  createdTime: item.created_time,
                  dealAmount: item.deal_amount,
                  dealStatus: item.deal_status,
                  investorId: item.investor_id,
                  username: item.username,
                };
              }
              return undefined;
            })
            .filter((item) => item !== undefined) as {
            avatarUrl: string;
            createdTime: Date;
            dealAmount: number;
            dealStatus: string;
            investorId: string;
            username: string;
          }[]
        );
      }
    };
    setTopLatestInvestment();
  }, [currentProjectId, investmentDetail?.data]);

  if (isLoadingSession && isLoadingProjects) {
    return <LegacyLoader />;
  }

  return (
    <div className="container max-w-screen-xl">
      {/* <Loader isSuccess={!isLoadingSession && !isLoadingProjects} />{" "} */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Business Dashboard</h2>
        </div>
        {projects && projects.length > 0 && (
          <Tabs className="space-y-4" defaultValue={projects[0].project_name}>
            <TabsList>
              {projects.map((project) => (
                <TabsTrigger
                  key={project.id}
                  value={project.project_name}
                  onClick={() => setCurrentProjectId(project.id)}
                >
                  {project.project_name}
                </TabsTrigger>
              ))}
            </TabsList>
            {projects.map((project) => (
              <TabsContent value={project.project_name} className="space-y-4" key={project.id}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Funds Raised</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        $
                        <CountUp
                          end={filteredProject
                            .filter((project) => project.deal_status === "Completed")
                            .reduce((sum, current) => sum + current.deal_amount, 0)}
                          duration={1}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        +<CountUp end={2350} duration={1} />
                      </div>
                      {/* <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p> */}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        +<CountUp end={12234} duration={1} />
                      </div>
                      {/* <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p> */}
                    </CardContent>
                  </Card>
                  <Button
                    onClick={() => {
                      router.push(`/project/${project.id}/edit`);
                    }}
                    className="h-full bg-emerald-500 hover:bg-emerald-800 font-bold text-xl"
                  >
                    Edit Project
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 17.25V21h3.75l11.05-11.05-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0L15.13 4.5l3.75 3.75 1.83-1.21z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                      <TabsList className="grid w-56 grid-cols-3 ml-5">
                        {tabOptions.map((tab) => (
                          <TabsTrigger key={tab} value={tab}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <CardContent className="pl-2 mt-5">
                        <Overview graphType={graphType} data={graphData} />

                        <Tabs defaultValue="line" className="space-y-4 ml-[50%] mt-2">
                          <TabsList>
                            <TabsTrigger value="line" onClick={() => setGraphType("line")}>
                              Line
                            </TabsTrigger>
                            <TabsTrigger value="bar" onClick={() => setGraphType("bar")}>
                              Bar
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </CardContent>
                    </Tabs>
                  </Card>
                  <Card className="col-span-4 md:col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Funds</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-flow-dense w-full">
                      <RecentFunds
                        data={latestInvestment.map((item) => {
                          return {
                            name: item.username,
                            amount: item.dealAmount,
                            avatar: item.avatarUrl,
                            date: new Date(item.createdTime),
                            status: item.dealStatus,
                            profile_url: `/profile/${item.investorId}`,
                          };
                        })}
                      />
                      <div className="flex justify-center mt-5">
                        {filteredProject && filteredProject.length > 1 ? (
                          <Modal
                            data={filteredProject.map((item) => {
                              return {
                                date: item.created_time,
                                name: item.username,
                                amount: item.deal_amount,
                                status: item.deal_status,
                                logoURL: Array.isArray(item.avatar_url) ? item.avatar_url[0] : item.avatar_url,
                                profileURL: `/profile/${item.investor_id}`,
                              };
                            })}
                          />
                        ) : undefined}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
