import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExtendableCard } from "@/components/extendableCard";

export default function Home() {
  return (
    <main>
      <div className="flex flex-row bg-slate-100 dark:bg-gray-800">
        <div className="flex flex-col w-3/5">
          <span className="px-10 md:px-28 py-10 md:py-20">
            <p className="text-lg md:text-4xl font-bold">Explore the world of ventures</p>
            <span className="text-sm md:text-lg">
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

      <div className="flex flex-row gap-0 md:gap-10 justify-start md:justify-center mt-3 md:mt-5">
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
            <Button className="flex gap-1 border-2 border-border rounded-md p-1 bg-background text-foreground scale-75 md:scale-100">
              <Image src={"/github.svg"} width={20} height={20} alt="github" className="scale-75 md:scale-100" />
              Github
            </Button>
            <Button className="flex gap-1 border-2 border-border rounded-md p-1 bg-background text-foreground scale-75 md:scale-100">
              <Image src={"/github.svg"} width={20} height={20} alt="github" className="scale-75 md:scale-100" />
              Github
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-6" />

      <div className="flex flex-col px-10 md:px-28">
        <span className="pb-5">
          <p className="text-xl md:text-2xl font-bold">Hottest Deals</p>
          <p className="text-md md:text-lg">The deals attracting the most interest right now</p>
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href={"/overview"}>
            <ExtendableCard
              name={"NVDA"}
              description={"Founded in 1993, NVIDIA is a key innovator of computer graphics and AI technology"}
              joinDate={"December 2021"}
              location={"Bangkok, Thailand"}
              tags={[]}
              minInvestment={10000}
              totalInvestor={58400}
              totalRaised={9000000}
            />
          </Link>
          <ExtendableCard
            name={"Apple Inc."}
            description={
              "Founded in 1976, Apple Inc. is a leading innovator in consumer electronics, software, and online services, known for products like the iPhone, MacBook, and the App Store."
            }
            joinDate={"February 2020"}
            location={"Cupertino, California, USA"}
            tags={[]}
            minInvestment={10000}
            totalInvestor={58400}
            totalRaised={9000000}
          />
          <ExtendableCard
            name={"Google LLC"}
            description={
              "Founded in 1998, Google LLC specializes in internet-related services and products, including search engines, online advertising, cloud computing, and the Android operating system."
            }
            joinDate={"April 2019"}
            location={"Mountain View, California, USA"}
            tags={[]}
            minInvestment={10000}
            totalInvestor={5000}
            totalRaised={1500000000}
          />
          <ExtendableCard
            name={"Microsoft Corporation"}
            description={"Microsoft Corporation is a multinational technology company."}
            joinDate={"January 2018"}
            location={"California, USA"}
            tags={[]}
            minInvestment={250}
            totalInvestor={5000}
            totalRaised={1500000}
          />
        </div>
        <div className="self-center py-5 scale-75 md:scale-100">
          <Button>
            <Link href={"/deals"}>View all</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
