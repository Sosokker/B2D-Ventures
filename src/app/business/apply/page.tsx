"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useEffect, useState } from "react";

export default function Apply() {
  let supabase = createSupabaseClient();
  const [industry, setIndustry] = useState<string[]>([]);

  const fetchIndustry = async () => {
    let { data: BusinessType, error } = await supabase
      .from("BusinessType")
      .select("value");

    if (error) {
      console.error(error);
    } else {
      if (BusinessType) {
        console.table();
        setIndustry(BusinessType.map((item) => item.value));
      }
    }
  };
  useEffect(() => {
    fetchIndustry();
  }, []);
  return (
    <div>
      <div className="grid grid-flow-row auto-rows-max w-full h-52 md:h-92 bg-gray-100 dark:bg-gray-800 p-5">
        <h1 className="text-2xl md:text-5xl font-medium md:font-bold justify-self-center md:mt-8">
          Apply to raise on B2DVentures
        </h1>
        <div className="mt-5 justify-self-center">
          <p className="text-sm md:text-base text-neutral-500">
            All information submitted in this application is for internal use
            only and is treated with the utmost{" "}
          </p>
          <p className="text-sm md:text-base text-neutral-500">
            confidentiality. Companies may apply to raise with B2DVentures more
            than once.
          </p>
        </div>
      </div>
      <div className="grid grid-flow-row auto-rows-max w-full">
        <h1 className="text-3xl font-bold mt-10 ml-96">About your company</h1>
        <p className="ml-96 mt-5 text-neutral-500">
          All requested information in this section is required.
        </p>
        {/* form */}
        <div className="ml-96 mt-5 space-y-5">
          {/* company name */}
          <Label htmlFor="companyName" className="font-bold text-lg">
            Company name
          </Label>
          <div className="flex space-x-5">
            <Input type="text" id="companyName" className="w-96" />
            <span className="text-[13px] text-neutral-500 self-center">
              This should be the name your company uses on your <br />
              website and in the market.
            </span>
          </div>
          <div className="mt-5 space-y-5">
            {/* industry */}
            <Label htmlFor="industry" className="font-bold text-lg mt-10">
              Industry
            </Label>
            <div className="flex space-x-5">
              <Select>
                <SelectTrigger className="w-96">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Industry</SelectLabel>
                    {industry.map((i) => (
                      <SelectItem value={i}>{i}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span className="text-[13px] text-neutral-500 self-center">
                This should be the name your company uses on your <br />
                website and in the market.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
