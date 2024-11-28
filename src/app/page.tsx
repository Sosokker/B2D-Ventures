import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTopProjects } from "@/lib/data/projectQuery";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { Suspense } from "react";
import { ProjectSection } from "@/components/ProjectSection";

const ProjectsLoader = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
    ))}
  </div>
);
export default async function Home() {
  const supabase = createSupabaseClient();
  const { data: topProjectsData, error: topProjectsError } = await getTopProjects(supabase);

  const formattedProjects =
    topProjectsData?.map((project) => ({
      ...project,
      id: project.project_id,
    })) || [];

  return (
    <main>
      <div className="relative mx-auto">
        {/* Expanded div */}
        <div className="flex flex-row bg-slate-100 dark:bg-gray-800">
          <div className="container max-w-screen-xl flex flex-col">
            <span className="mx-20 px-10 py-10">
              <p className="text-4xl font-bold">Explore the world of ventures</p>
              <span className="text-lg">
                <p>Unlock opportunities and connect with a community of passionate</p>
                <p>investors and innovators.</p>
                <p>Together, we turn ideas into impact.</p>
              </span>
              <Button className="scale-75 md:scale-100 font-bold mt-4">
                <Link href="/deals">Start Investing</Link>
              </Button>
            </span>
          </div>
          <div className="flex justify-center items-center mt-2">
            <Image
              src="/money.png"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "50%", height: "auto" }}
              alt="Money"
            />
          </div>
        </div>
      </div>

      <div className="container max-w-screen-xl">
        <div className="flex flex-row gap-12 justify-start md:justify-center mt-3 md:mt-5">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl">100M+</CardTitle>
              <CardDescription>Global investor community</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl">2,500+</CardTitle>
              <CardDescription>Ventures supported</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl">$2.6B+</CardTitle>
              <CardDescription>Capital raised</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-2xl">Follow Us</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link href="https://github.com/Sosokker/B2D-Ventures" passHref>
                <Button className="flex gap-1 border-2 border-border rounded-md p-1 bg-background text-foreground scale-75 md:scale-100">
                  <div className="dark:bg-white rounded-full">
                    <Image src={"/github.svg"} width={20} height={20} alt="github" className="scale-75 md:scale-100" />
                  </div>
                  Github
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col px-10">
          <span className="pb-5">
            <p className="text-xl md:text-2xl font-bold">Hottest Deals</p>
            <p className="text-md md:text-lg">The deals attracting the most interest right now</p>
          </span>
          {topProjectsError ? (
            <div className="text-center text-red-600">
              <p>Failed to load top projects. Please try again later.</p>
            </div>
          ) : (
            <Suspense fallback={<ProjectsLoader />}>
              <ProjectSection projectsData={formattedProjects} />
            </Suspense>
          )}
          <div className="self-center py-5 scale-75 md:scale-100">
            <Button>
              <Link href={"/deals"}>View all</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
