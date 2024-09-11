"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Clock3Icon } from "lucide-react";

export default function Deals() {
  const [postAtFilter, setPostAtFilter] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("");
  const handlePostAtFilter = (value: string) => {
    setPostAtFilter(value);
  };
  return (
    <div>
      <div className=" w-full h-[350px] mt-10 ml-[15%]">
        <h1 className="text-4xl font-bold">Investment Opportunities </h1>
        <br />
        <p>Browse current investment opportunities on Republic. </p>
        <p>
          All companies are <u>vetted & pass due diligence.</u>
        </p>
        <div className="flex mt-10 bg-red-500 gap-3">
          <Select onValueChange={handlePostAtFilter}>
            <SelectTrigger className="w-[180px]">
              <Clock3Icon className="ml-2" />
              <SelectValue placeholder="Posted at" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Today">Today</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setContentTypeFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <Clock3Icon className="ml-2" />
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">blog</SelectItem>
            </SelectContent>
          </Select>
          {postAtFilter}
          {contentTypeFilter}
        </div>
      </div>
    </div>
  );
}
