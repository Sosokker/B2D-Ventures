"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Clock3Icon,
  MessageSquareIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ExtendableCard } from "@/components/extendableCard";

export default function Deals() {
  const [postAtFilter, setPostAtFilter] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [groupsFilter, setGroupFilter] = useState("");
  const data = [
    {
      name: "NVDA",
      description:
        "Founded in 1993, NVIDIA is a key innovator of computer graphics and AI technology",
      joinDate: "December 2021",
      location: "Bangkok, Thailand",
      tags: null,
      minInvestment: 10000,
      totalInvestor: 58400,
      totalRaised: 9000000,
    },
    {
      name: "Apple Inc.",
      description:
        "Founded in 1976, Apple Inc. is a leading innovator in consumer electronics, software, and online services, known for products like the iPhone, MacBook, and the App Store.",
      joinDate: "February 2020",
      location: "Cupertino, California, USA",
      tags: null,
      minInvestment: 10000,
      totalInvestor: 58400,
      totalRaised: 9000000,
    },
    {
      name: "Google LLC",
      description:
        "Founded in 1998, Google LLC specializes in internet-related services and products, including search engines, online advertising, cloud computing, and the Android operating system.",
      joinDate: "April 2019",
      location: "Mountain View, California, USA",
      tags: null,
      minInvestment: 10000,
      totalInvestor: 5000,
      totalRaised: 1500000000,
    },
    {
      name: "Microsoft Corporation",
      description:
        "Microsoft Corporation is a multinational technology company.",
      joinDate: "January 2018",
      location: "California, USA",
      tags: null,
      minInvestment: 250,
      totalInvestor: 5000,
      totalRaised: 1500000,
    },
  ];

  return (
    <div>
      <div className=" w-1/2 h-[250px] mt-10 ml-[15%]">
        <h1 className="text-4xl font-bold">Investment Opportunities </h1>
        <br />
        <p>Browse current investment opportunities on Republic. </p>
        <p>
          All companies are <u>vetted & pass due diligence.</u>
        </p>
        {/* filters */}
        <div className="flex mt-10 gap-3">
          <Select onValueChange={(value) => setPostAtFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <Clock3Icon className="ml-2" />
              <SelectValue placeholder="Posted at" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Yesterday">Yesterday</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setContentTypeFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <MessageSquareIcon className="ml-2" />
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Blog">Blog</SelectItem>
              <SelectItem value="Youtube">Youtube</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setAuthorFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <UserIcon className="ml-2" />
              <SelectValue placeholder="Author" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Me">Me</SelectItem>
              <SelectItem value="Charlie Puth">Charlie Puth</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setGroupFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <UsersIcon />
              <SelectValue placeholder="Sent to groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Group1">Group1</SelectItem>
              <SelectItem value="Group2">Group2</SelectItem>
            </SelectContent>
          </Select>
          {/* {postAtFilter}
          {contentTypeFilter}
          {authorFilter}
          {groupsFilter} */}
        </div>
        <Separator className="mt-10" />
      </div>

      <div className="ml-[15%]">
        <h2 className="text-2xl">Deals</h2>
        <p className="mt-3">The deals attracting the most interest right now</p>
      </div>
      {/* block for all the deals */}
      <div className="ml-[15%] mt-10 grid grid-cols-3">
        {data.map((item, index) => (
          <ExtendableCard
            key={index}
            name={item.name}
            description={item.description}
            joinDate={item.joinDate}
            location={item.location}
            minInvestment={item.minInvestment}
            totalInvestor={item.totalInvestor}
            totalRaised={item.totalRaised}
            tags={item.tags}
          />
        ))}
      </div>
    </div>
  );
}
