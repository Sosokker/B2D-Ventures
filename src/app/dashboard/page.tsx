"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/ui/overview";
import { RecentFunds } from "@/components/recent-funds";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";

export default function Dashboard() {
  type Deal = {
    deal_amount: number;
    created_time: Date;
    investor_id: string;
  };

  let supabase = createSupabaseClient();
  const [graphType, setGraphType] = useState("line");
  const [dealList, setDealList] = useState<Deal[]>();
  const totalDealAmount = dealList?.reduce((sum, deal) => sum + deal.deal_amount, 0) || 0;

  // get current user id
  // #TODO extract function to lib/util
  const getUserID = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.error('Error fetching user:', error);
      return;
    }

    return user.id;
  }

  const getDealList = async () => {
    const userId = await getUserID();
    const { data: dealData, error } = await supabase
    .from('business')
    .select(`
      id,
      project (
        id,
        investment_deal (
          deal_amount,
          created_time,
          investor_id
        )
      )
    `)
    .eq('user_id', userId)
    .single();

    if (error || !dealData) {
      alert(JSON.stringify(error));
      console.error('Error fetching deal amount:', error);
    } else {
      const dealList = dealData.project[0].investment_deal;

      if (!dealList.length) {
        alert("No data available");
        return; // Exit early if there's no data
      }

      // Sort the dealList by created_time in descending order
      const byCreatedTimeDesc = (a: Deal, b: Deal) =>
        new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
      return dealList.sort(byCreatedTimeDesc);
    }
  }

  const fetchDealList = async () => {
    setDealList(await getDealList());
  }

  useEffect(() => {
    fetchDealList();
  }, []);
  return (
    <>
      {dealList?.map((deal, index) => (
        <div key={index} className="deal-item">
          <p>Deal Amount: {deal.deal_amount}</p>
          <p>Created Time: {new Date(deal.created_time).toUTCString()}</p>
          <p>Investor ID: {deal.investor_id}</p>
        </div>
      ))}
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
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Funds Raised
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
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalDealAmount}</div>
                    {/* <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Profile Views
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
                    <CardTitle className="text-sm font-medium">
                      Total Followers
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
                    <Overview graphType={graphType} />
                    {/* tab to switch between line and bar graph */}
                    <Tabs
                      defaultValue="line"
                      className="space-y-4 ml-[50%] mt-2"
                    >
                      <TabsList>
                        <TabsTrigger
                          value="line"
                          onClick={() => setGraphType("line")}
                        >
                          Line
                        </TabsTrigger>
                        <TabsTrigger
                          value="bar"
                          onClick={() => setGraphType("bar")}
                        >
                          Bar
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Funds</CardTitle>
                    <CardDescription>
                      You made {dealList?.length || 0} sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentFunds>
                    </RecentFunds>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
