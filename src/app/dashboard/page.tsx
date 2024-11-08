"use client";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/ui/overview";
import { RecentFunds } from "@/components/recent-funds";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import useSession from "@/lib/supabase/useSession";
import { getProjectByUserId } from "@/lib/data/projectQuery";
import { Loader } from "@/components/loading/loader";
import { getInvestmentByProjectsIds } from "@/lib/data/investmentQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { usePathname } from "next/navigation";
import { overAllGraphData, Deal } from "../portfolio/[uid]/query";
import { getUserProfile } from "@/lib/data/userQuery";
import { Item } from "@radix-ui/react-navigation-menu";

export default function Dashboard() {
  const supabase = createSupabaseClient();
  const pathname = usePathname();
  const userId = useSession().session?.user.id;
  const [projects, setProjects] = useState<
    { id: number; project_name: string; business_id: { user_id: number }[]; dataroom_id: number }[]
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [graphType, setGraphType] = useState("line");
  const [currentProjectId, setCurrentProjectId] = useState<number>(projects[0]?.id);
  const investmentDetail = useQuery(
    getInvestmentByProjectsIds(
      supabase,
      projects.map((item) => {
        return item.id.toString();
      })
    )
  );
  useEffect(() => {
    const setTopLatestInvestment = () => {
      if (investmentDetail?.data) {
        setLatestInvestment(
          investmentDetail.data
            .slice(0, 8)
            .map((item) => {
              // set the project according to current project id
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
        console.table(latestInvestment)
      }
    };
    setTopLatestInvestment();
  }, [supabase, investmentDetail]);
  useEffect(() => {
    const fetchProjects = async () => {
      if (userId) {
        const { data, error } = await getProjectByUserId(supabase, userId);
        // alert(JSON.stringify(data));
        if (error) {
          console.error("Error while fetching projects");
        }
        if (data) {
          setProjects(data);
          // console.table(data);
        }
      } else {
        console.error("Error with UserId while fetching projects");
      }
      setIsSuccess(true);
    };
    fetchProjects();
  }, [supabase, userId]);
  // console.table(projects);
  // console.table(latestInvestment);

  return (
    <div className="container max-w-screen-xl">
      <Loader isSuccess={isSuccess} />
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Business Dashboard</h2>
          </div>

          <Tabs className="space-y-4">
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
              <TabsContent value={project.project_name} className="space-y-4">
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
                      <div className="text-2xl font-bold">${}</div>
                      {/* <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p> */}
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
                      <div className="text-2xl font-bold">+2350</div>
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
                      <div className="text-2xl font-bold">+12,234</div>
                      {/* <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p> */}
                    </CardContent>
                  </Card>
                  {/* <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Now
                    </CardTitle>
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
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card> */}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      {/* <Overview
                        graphType={graphType}
                        data={overAllGraphData(
                          investmentDetail?.data
                            ?.map((deal) => {
                              if (deal.project_id === currentProjectId) {
                                return {
                                  deal_amount: deal.deal_amount,
                                  created_time: deal.created_time,
                                };
                              }
                              return undefined;
                            })
                            .filter((deal) => deal !== undefined) as Deal[]
                        )}
                      /> */}
                      {/* tab to switch between line and bar graph */}
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
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Funds</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
