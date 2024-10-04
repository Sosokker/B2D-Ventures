"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Clock3Icon, MessageSquareIcon, UserIcon, UsersIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ExtendableCard } from "@/components/extendableCard";

export default function Deals() {
  const [postAtFilter, setPostAtFilter] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [groupsFilter, setGroupFilter] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const data = [
    {
      name: "NVDA",
      description: "Founded in 1993, NVIDIA is a key innovator of computer graphics and AI technology",
      joinDate: "December 2021",
      location: "Bangkok, Thailand",
      tags: ["AI", "Technology"],
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
      tags: ["Consumer Electronics", "Software"],
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
      tags: ["Internet", "Search Engine"],
      minInvestment: 10000,
      totalInvestor: 5000,
      totalRaised: 1500000000,
    },
    {
      name: "Microsoft Corporation",
      description: "Microsoft Corporation is a multinational technology company.",
      joinDate: "January 2018",
      location: "California, USA",
      tags: ["Technology", "Software"],
      minInvestment: 250,
      totalInvestor: 5000,
      totalRaised: 1500000,
    },
  ];

  const filteredData = selectedTag ? data.filter((item) => item.tags.includes(selectedTag)) : data;

  return (
    <div>
      <div className=" w-1/2 h-[250px] mt-10 ml-[15%]">
        <h1 className="text-4xl font-bold">Investment Opportunities</h1>
        <br />
        <p>Browse current investment opportunities on B2DVenture.</p>
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
          <Select onValueChange={(value) => setSelectedTag(value)}>
            {" "}
            {/* Tag filtering */}
            <SelectTrigger className="w-[180px]">
              <MessageSquareIcon className="ml-2" />
              <SelectValue placeholder="Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_">All Tags</SelectItem> {/* Reset filter */}
              <SelectItem value="AI">AI</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Consumer Electronics">Consumer Electronics</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Internet">Internet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="mt-10" />
      </div>

      <div className="ml-[15%]">
        <h2 className="text-2xl">Deals</h2>
        <p className="mt-3">The deals attracting the most interest right now</p>
      </div>
      {/* block for all the deals */}
      <div className="mx-[15%] mt-10 grid grid-cols-3">
        {filteredData.map((item, index) => (
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
