import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessCard } from "@/components/businessCard";
import { Separator } from "@/components/ui/separator";
import { ExtendableCard } from "@/components/extendable-card";

export default function Home() {
  return (
    <main>
      <div className="flex flex-row bg-slate-100 dark:bg-gray-800">
        <div className="flex flex-col w-3/5">
          <span className="px-28 py-20">
            <p className="text-4xl font-bold">Explore the world of ventures</p>
            <span className="text-lg">
              <p>Unlock opportunities and connect with a community of passionate</p>
              <p>investors and innovators.</p>
              <p>Together, we turn ideas into impact.</p>
            </span>
            <Button className="font-bold mt-4">
              <Link href="/login">Start Investing</Link>
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

      <div className="flex flex-row gap-10 justify-center mt-5">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>100M+</CardTitle>
            <CardDescription>Global investor community</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>2,500+</CardTitle>
            <CardDescription>Ventures supported</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>$2.6B+</CardTitle>
            <CardDescription>Capital raised</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle>Follow Us</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button className="flex gap-1 border-2 border-border rounded-md p-1 bg-background text-foreground">
              <Image src={"/github.svg"} width={20} height={20} alt="github" />
              Github
            </Button>
            <Button className="flex gap-1 border-2 border-border rounded-md p-1 bg-background text-foreground">
              <Image src={"/github.svg"} width={20} height={20} alt="github" />
              Github
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-6" />

      <div className="flex flex-col px-28">
        <span className="pb-5">
          <p className="text-2xl font-bold">Hottest Deals</p>
          <p className="text-lg">The deals attracting the most interest right now</p>
        </span>
        <div className="grid grid-cols-4 gap-4">
          <BusinessCard name={"NVDA"} description={"Founded in 1993, NVIDIA is a key innovator of computer graphics and AI technology"} joinDate={"December 2021"} location={"Bangkok, Thailand"} tags={null} />
          <BusinessCard name={"Apple Inc."} description={"Founded in 1976, Apple Inc. is a leading innovator in consumer electronics, software, and online services, known for products like the iPhone, MacBook, and the App Store."} joinDate={"February 2020"} location={"Cupertino, California, USA"} tags={null} />
          <BusinessCard name={"Google LLC"} description={"Founded in 1998, Google LLC specializes in internet-related services and products, including search engines, online advertising, cloud computing, and the Android operating system."} joinDate={"April 2019"} location={"Mountain View, California, USA"} tags={null} />
          <BusinessCard name={"Microsoft Corporation"} description={"Founded in 1975, Microsoft Corporation is a multinational technology company that develops, manufactures, and licenses software, hardware, and services, including Windows, Office, and Azure."} joinDate={"January 2018"} location={""} tags={null} />
        </div>
        <div className="self-center py-5">
          <Button>
            <Link href={"/invest"}>View all</Link>
          </Button>
        </div>
      </div>
      <ExtendableCard/>
    </main>
  );
}
