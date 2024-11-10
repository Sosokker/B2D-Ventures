import Image from "next/image";
import Link from "next/link";

import ReactMarkdown from "react-markdown";

import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import FollowShareButtons from "./followShareButton";
import { DisplayFullImage } from "./displayImage";
import { getProjectData } from "@/lib/data/projectQuery";
import { getDealList } from "@/app/api/dealApi";
import { sumByKey, toPercentage } from "@/lib/utils";
import { redirect } from "next/navigation";
import { isOwnerOfProject } from "./query";
import { UpdateTab } from "./UpdateTab";
import remarkGfm from "remark-gfm";

const PHOTO_MATERIAL_ID = 2;

export default async function ProjectDealPage({ params }: { params: { id: number } }) {
  const supabase = createSupabaseClient();
  const { data: projectData, error: projectDataError } = await getProjectData(supabase, params.id);
  const { data: user, error: userError } = await supabase.auth.getUser();
  const { data: projectMaterial, error: projectMaterialError } = await supabase
    .from("project_material")
    .select("material_url")
    .eq("project_id", params.id)
    .eq("material_type_id", PHOTO_MATERIAL_ID);

  if (projectMaterialError) {
    console.error("Error while fetching project material" + projectMaterialError);
  }
  if (!projectData) {
    redirect("/deals");
  }

  if (projectDataError) {
    return (
      <div className="container max-w-screen-xl my-5">
        <p className="text-red-600">Error fetching data. Please try again.</p>
        <Link href={`/deals/${params.id}`} className="mt-4">
          <Button className="mt-4">Refresh</Button>
        </Link>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="container max-w-screen-xl my-5">
        <p className="text-red-600">Error fetching data. Please try again.</p>
        <Link href={`/deals/${params.id}`} className="mt-4">
          <Button className="mt-4">Refresh</Button>
        </Link>
      </div>
    );
  }

  const isOwner = await isOwnerOfProject(supabase, params.id, user.user?.id);

  const projectBusinessOwnerId = projectData.user_id;
  const dealList = await getDealList(projectBusinessOwnerId);
  const totalDealAmount = sumByKey(dealList, "deal_amount");
  // timeDiff, if negative convert to zero
  const timeDiff = Math.max(new Date(projectData.investment_deadline).getTime() - new Date().getTime(), 0);
  const hourLeft = Math.floor(timeDiff / (1000 * 60 * 60));

  const carouselData =
    projectMaterial && projectMaterial.length > 0
      ? projectMaterial.flatMap((item) =>
          (item.material_url || ["/boiler1.jpg"]).map((url: string) => ({
            src: url,
            alt: "Image",
          }))
        )
      : [{ src: "/boiler1.jpg", alt: "Default Boiler Image" }];

  return (
    <div className="container max-w-screen-xl my-5">
      <div className="flex flex-col gap-y-10">
        {/* Name, star and share button packed */}
        <div id="header" className="flex flex-col">
          <div className="flex justify-between">
            <span className="flex">
              <Image src="/logo.svg" alt="logo" width={50} height={50} className="sm:scale-75" />
              <h1 className="mt-3 font-bold  text-lg md:text-3xl">{projectData?.project_name}</h1>
            </span>
            <FollowShareButtons userId={user!.user.id} projectId={params.id} />
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
          <div id="image-carousel" className="shrink-0 w-[700px] flex flex-col">
            {/* first carousel */}
            <Carousel className="w-full h-[400px] ml-1 overflow-hidden">
              <CarouselContent className="flex h-full">
                {carouselData.map((item, index) => (
                  <CarouselItem key={index}>
                    <Image src={item.src} alt={item.alt} width={700} height={400} className="rounded-lg object-cover" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black opacity-50 hover:opacity-100" />
              <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black opacity-50 hover:opacity-100" />
            </Carousel>
            {/* second carousel */}
            <Carousel className="w-full ml-1 h-[100px] mt-5 overflow-hidden">
              <CarouselContent className="flex space-x-1 h-[100px]">
                {carouselData.map((item, index) => (
                  <CarouselItem key={index} className="flex">
                    <DisplayFullImage
                      src={item.src}
                      alt={item.alt}
                      width={200}
                      height={100}
                      className="rounded-lg object-cover h-[100px] w-[200px]"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <Card className="w-[80%] ml-10 shadow-sm">
            <CardContent>
              <div id="stats" className="flex flex-col w-full mt-4">
                <div className="pl-5">
                  <span>
                    <h1 className="font-semibold text-xl md:text-4xl mt-8">${totalDealAmount}</h1>
                    <p className="text-sm md:text-lg">
                      {toPercentage(totalDealAmount, projectData?.target_investment)}% raised of $
                      {projectData?.target_investment} max goal
                    </p>
                    <Progress
                      value={toPercentage(totalDealAmount, projectData?.target_investment)}
                      className="w-4/5 h-3 mt-3 border-2"
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
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col space-y-4 mt-3">
              <div className="flex justify-between w-full">
                <Button className="w-full h-12 dark:text-white truncate">
                  <Link href={`/invest/${params.id}`}>Invest in {projectData?.project_name}</Link>
                </Button>
                {isOwner && (
                  <Button className="w-[48%] ml-4 h-12 dark:text-white" variant={"outline"}>
                    <Link href={`/project/${params.id}/edit`}>Edit</Link>
                  </Button>
                )}
              </div>
              <div className="flex justify-between w-full">
                <Button className="w-[48%] h-12 dark:text-white" variant={"outline"}>
                  <Link href={`/dataroom/${params.id}/files`}>Access Dataroom</Link>
                </Button>
                <Button className="w-[48%] h-12 dark:text-white" variant={"outline"}>
                  <Link href={`/dataroom/overview`}>Request Dataroom Access</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* <div id="stats" className="flex flex-col w-full mt-4 pl-12">
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
              <Button className="mt-5 w-3/4 h-12 dark:text-white">
                <Link href={`/invest/${params.id}`}>Invest in {projectData?.project_name}</Link>
              </Button>
              <div className="flex flex-col space-y-2 py-4 mt-5 w-3/4 h-12 border-2 border-border rounded-md">
                <p className="text-md font-bold">Dataroom</p>
                <Button className=" dark:text-white">
                  <Link href={`/invest/${params.id}`}>Access Dataroom</Link>
                </Button>
                <Button className=" dark:text-white">
                  <Link href={`/invest/${params.id}`}>Manage Dataroom</Link>
                </Button>
              </div>
            </div>
          </div> */}
        </div>
        {/* menu */}
        <div id="deck">
          <div className="flex w-full">
            <Tabs.Root defaultValue="pitch" className="w-full">
              <Tabs.List className="list-none flex gap-10 text-lg md:text-xl">
                <Tabs.Trigger value="pitch">Pitch</Tabs.Trigger>
                {/* <Tabs.Trigger value="general">General Data</Tabs.Trigger> */}
                <Tabs.Trigger value="update">Updates</Tabs.Trigger>
              </Tabs.List>
              <Separator className="mb-4 mt-2 w-full border-1" />
              <Tabs.Content value="pitch">
                <Card>
                  <CardHeader>
                    <CardTitle>{projectData.project_name}</CardTitle>
                    <CardDescription>Project Pitch</CardDescription>
                    <Separator className="my-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert prose-sm max-w-none ">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {projectData?.project_description || "No pitch available."}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </Tabs.Content>
              {/* <Tabs.Content value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>general</CardTitle>
                    <CardDescription>general Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>general Content</p>
                  </CardContent>
                </Card>
              </Tabs.Content> */}
              <Tabs.Content value="update">
                <Card>
                  <CardHeader>
                    <CardTitle>Update</CardTitle>
                    <CardDescription>Project log and updates</CardDescription>
                    <Separator className="my-4" />
                  </CardHeader>
                  <CardContent>
                    <UpdateTab projectId={params.id} />
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
