import Image from "next/image";
import Link from "next/link";

import ReactMarkdown from "react-markdown";

import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import FollowShareButtons from "./followShareButton";
import { DisplayFullImage } from "./displayImage";

import { getProjectData } from "@/lib/data/projectQuery";
import { getDealList } from "@/app/api/dealApi";
import { sumByKey, toPercentage } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function ProjectDealPage({ params }: { params: { id: number } }) {
  const supabase = createSupabaseClient();
  const { data: projectData, error: projectDataError } = await getProjectData(supabase, params.id);

  if (!projectData) {
    redirect("/deals");
  }

  if (projectDataError) {
    return (
      <div className="container max-w-screen-xl my-5">
        <p className="text-red-600">Error fetching data. Please try again.</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    );
  }

  const projectBusinessOwnerId = projectData.user_id;
  const dealList = await getDealList(projectBusinessOwnerId);
  const totalDealAmount = sumByKey(dealList, "deal_amount");
  // timeDiff, if negative convert to zero
  const timeDiff = Math.max(new Date(projectData.investment_deadline).getTime() - new Date().getTime(), 0);
  const hourLeft = Math.floor(timeDiff / (1000 * 60 * 60));

  const carouselData = Array(5).fill({
    src: projectData.card_image_url || "/boiler1.jpg",
    alt: `${projectData.project_name} Image`,
  });


  return (
    <div className="container max-w-screen-xl my-5">
      <div className="flex flex-col gap-y-10">
        <div id="content">
          {/* Name, star and share button packed */}
          <div id="header" className="flex flex-col">
            <div className="flex justify-between">
              <span className="flex">
                <Image src="/logo.svg" alt="logo" width={50} height={50} className="sm:scale-75" />
                <h1 className="mt-3 font-bold  text-lg md:text-3xl">{projectData?.project_name}</h1>
              </span>
              <FollowShareButtons />
            </div>
            {/* end of pack */}
            <p className="mt-2 sm:text-sm">{projectData?.project_short_description}</p>
            <div className="flex flex-wrap mt-3">
              {projectData?.tags.map((tag, index) => (
                <span key={index} className="text-xs rounded-md bg-slate-200 dark:bg-slate-700 p-1 mx-1 mb-1">
                  {tag.tag_name}
                </span>
              ))}
            </div>
          </div>
          <div id="sub-content" className="flex flex-row mt-5">
            {/* image carousel */}
            <div id="image-corousel" className="shrink-0 w-[700px] flex flex-col">
              <Carousel className="w-full h-full ml-1">
                <CarouselContent className="flex h-full">
                  {carouselData.map((item, index) => (
                    <CarouselItem key={index}>
                      <Image src={item.src} alt={item.alt} width={700} height={400} className="rounded-lg" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              <Carousel className="w-full ml-1 h-[100px] mt-5">
                <CarouselContent className="flex space-x-1">
                  {carouselData.map((item, index) => (
                    <CarouselItem key={index} className="flex">
                      <DisplayFullImage item={item} width={200} height={100}/>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div id="stats" className="flex flex-col w-full mt-4 pl-12">
              <div className="pl-5">
                <span>
                  <h1 className="font-semibold text-xl md:text-4xl mt-8">${totalDealAmount}</h1>
                  <p className="text-sm md:text-lg">
                    {toPercentage(totalDealAmount, projectData?.target_investment)}% raised of $
                    {projectData?.target_investment} max goal
                  </p>
                  <Progress
                    value={toPercentage(totalDealAmount, projectData?.target_investment)}
                    className="w-[60%] h-3 mt-3"
                  />
                </span>
                <span>
                  <h1 className="font-semibold text-4xl md:mt-8">
                    <p className="text-xl md:text-4xl">{dealList.length}</p>
                  </h1>
                  <p className="text-sm md:text-lg">Investors</p>
                </span>
                <Separator decorative className="mt-3 w-3/4 ml-5" />
                <span>
                  <h1 className="font-semibold text-xl md:text-4xl mt-8 ml-5"></h1>
                  {projectData?.investment_deadline ? (
                    <>
                      <p className="text-xl md:text-4xl">{Math.floor(hourLeft)} hours</p>
                      <p>Left to invest</p>
                    </>
                  ) : (
                    <p className="text-xl md:text-4xl">No deadline</p>
                  )}
                </span>
                <Button className="mt-5 w-3/4 h-12">
                  <Link href={`/invest/${params.id}`}>Invest in {projectData?.project_name}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* menu */}
        <div id="deck">
          <div className="flex w-fit">
            <Tabs.Root defaultValue="pitch">
              <Tabs.List className="list-none flex gap-10 text-lg md:text-xl">
                <Tabs.Trigger value="pitch" className="text-yellow-300">
                  Pitch
                </Tabs.Trigger>
                <Tabs.Trigger value="general">General Data</Tabs.Trigger>
                <Tabs.Trigger value="update">Updates</Tabs.Trigger>
              </Tabs.List>
              <Separator className="mb-4 mt-2 w-full border-1" />
              <Tabs.Content value="pitch">
                <Card>
                  <CardHeader>
                    <CardTitle>{projectData.project_name}</CardTitle>
                    <CardDescription />
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown className="text-black dark:text-white [&_*]:text-inherit">
                        {projectData?.project_description || "No pitch available."}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </Tabs.Content>
              <Tabs.Content value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>general</CardTitle>
                    <CardDescription>general Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>general Content</p>
                  </CardContent>
                </Card>
              </Tabs.Content>
              <Tabs.Content value="update">
                <Card>
                  <CardHeader>
                    <CardTitle>update</CardTitle>
                    <CardDescription>update Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>update Content</p>
                  </CardContent>
                </Card>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
