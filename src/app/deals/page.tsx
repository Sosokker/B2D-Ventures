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

export default function Deals() {
  const [postAtFilter, setPostAtFilter] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [groupsFilter, setGroupFilter] = useState("");
  return (
    <div>
      <div className=" w-full h-[350px] mt-10 ml-[15%]">
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
              <UsersIcon className="ml-2" />
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
      </div>
    </div>
  );
}
