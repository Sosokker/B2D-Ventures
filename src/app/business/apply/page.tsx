"use client";
import { Button } from "@/components/ui/button";
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

  const [companyName, setCompanyName] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [moneyRaisedToDate, setMoneyRaisedToDate] = useState("");
  const [isInUS, setIsInUS] = useState("");
  const [isForSale, setIsForSale] = useState("");
  const [isGeneratingRevenue, setIsGeneratingRevenue] = useState("");
  const [businessPitch, setBusinessPitch] = useState("");
  const [selectedCommunitySize, setSelectedCommunitySize] = useState("");

  const [industry, setIndustry] = useState<string[]>([]);
  const communitySize = [
    "N/A",
    "0-5K",
    "5-10K",
    "10-20K",
    "20-50K",
    "50-100K",
    "100K+",
  ];

  // get industry list to display in dropdown
  const fetchIndustry = async () => {
    let { data: businessType, error } = await supabase
      .from("business_type")
      .select("value");

    if (!businessType) {
      console.error(error);
    } else {
      setIndustry(businessType.map((item) => item.value));
    }
  };
  useEffect(() => {
    fetchIndustry();
  }, []);

  // get business id from business type
  const getBusinessTypeID = async () => {
    const { data, error } = await supabase
      .from('business_type')
      .select('id')
      .eq('value', selectedIndustry)
      .single();
  
    if (error) {
      console.error('Error fetching business ID:', error);
      return;
    }

    return data.id;
  };

  // get current user id
  const getUserID = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.error('Error fetching user:', error);
      return;
    }

    return user.id;
  }

  // format input data as json
  const createFormat = async () => {
    return {
      "company_name": companyName,
      "business_type_id": await getBusinessTypeID(),
      "raise_to_date": moneyRaisedToDate,  //TODO change to money_raised_to_date in database and change type to number
      "is_in_us": isInUS,
      "is_for_sale": isForSale,
      "is_generating_revenue": isGeneratingRevenue,
      "pitch_deck_url": businessPitch,
      "community_size": selectedCommunitySize,
      "created_at": new Date(),
      "user_id": await getUserID()
    }
  };

  // insert into business_application database
  const submitApplication = async () => {
    let format = await createFormat();
    // alert(JSON.stringify(format))          // debug message

    const { data, error } = await supabase
      .from('business_application')
      .insert([format]);

    if (error) {
      // return div error here
      console.error('Error inserting data:', error);
      // alert("Error" + JSON.stringify(error));
    } else {
      alert("Data successfully submitted!")
    }
  }

  return (
    <div>
      <div className="grid grid-flow-row auto-rows-max w-full h-52 md:h-92 bg-gray-100 dark:bg-gray-800 p-5">
        <h1 className="text-2xl md:text-5xl font-medium md:font-bold justify-self-center md:mt-8">
          Apply to raise on B2DVentures
        </h1>
        <div className="mt-5 justify-self-center">
          <p className="text-sm md:text-base text-neutral-500">
            All information submitted in this application is for internal use
            only and is treated with the utmost {" "}<br />
            confidentiality. Companies may apply to raise with B2DVentures more
            than once.
          </p>
        </div>
      </div>
      <div className="grid grid-flow-row auto-rows-max w-full ml-48">
        <h1 className="text-3xl font-bold mt-10 ml-96">About your company</h1>
        <p className="ml-96 mt-5 text-neutral-500">
          All requested information in this section are required.
        </p>
        {/* form */}

        {/* company name */}
        <div className="ml-96 mt-5 space-y-10">
          <div className="mt-10 space-y-5">
            <Label htmlFor="companyName" className="font-bold text-lg">
              Company Name
            </Label>
            <div className="flex space-x-5">
              <Input onChange={(event) => setCompanyName(event.target.value)} type="text" id="companyName" className="w-96" />
              <span className="text-[12px] text-neutral-500 self-center">
                This should be the name your company uses on your <br />
                website and in the market.
              </span>
            </div>
          </div>
          {/* industry */}
          <div className="mt-10 space-y-5">
            <Label htmlFor="industry" className="font-bold text-lg mt-10">
              Industry
            </Label>
            <div className="flex space-x-5">
              <Select onValueChange={(value) => setSelectedIndustry(value)}>
                <SelectTrigger className="w-96">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Industry</SelectLabel>
                    {industry.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span className="text-[12px] text-neutral-500 self-center">
                Choose the industry that best aligns with your business.
              </span>
            </div>
          </div>
          {/* How much money has your company raised to date? */}
          <div className="space-y-5">
            <Label htmlFor="companyName" className="font-bold text-lg">
              How much money has your company <br /> raised to date?
            </Label>
            <div className="flex space-x-5">
              <Input
                onChange={(event) => setMoneyRaisedToDate(event.target.value)}
                type="text"
                id="companyName"
                className="w-96"
                placeholder="$   1,000,000"
              />
              <span className="text-[12px] text-neutral-500 self-center">
                The sum total of past financing, including angel or venture{" "}
                <br />
                capital, loans, grants, or token sales.
              </span>
            </div>
          </div>
          {/* Is your company incorporated in the United States? */}
          <div className="space-y-5">
            <Label htmlFor="companyName" className="font-bold text-lg">
              Is your company incorporated in the <br />
              United States?
            </Label>
            <div className="flex space-x-5">
              <div className="flex space-x-2 w-96">
                <Button
                  variant={isInUS === "Yes" ? "default" : "outline"}
                  onClick={() => setIsInUS("Yes")}
                  className="w-20 h-12 text-base"
                >
                  Yes
                </Button>
                <Button
                  variant={isInUS === "No" ? "default" : "outline"}
                  onClick={() => setIsInUS("No")}
                  className="w-20 h-12 text-base"
                >
                  No
                </Button>
              </div>
              <span className="text-[12px] text-neutral-500 self-center">
                Only companies that are incorporated or formed in the US are{" "}
                <br />
                eligible to raise via Reg CF. If your company is incorporated{" "}
                <br />
                outside the US, we still encourage you to apply.
              </span>
            </div>
          </div>

          {/* Is your product available (for sale) in market? */}
          <div className="space-y-5">
            <Label htmlFor="companyName" className="font-bold text-lg">
              Is your product available (for sale) <br />
              in market?
            </Label>
            <div className="flex space-x-5">
              <div className="flex space-x-2 w-96">
                <Button
                  variant={isForSale === "Yes" ? "default" : "outline"}
                  onClick={() => setIsForSale("Yes")}
                  className="w-20 h-12 text-base"
                >
                  Yes
                </Button>
                <Button
                  variant={isForSale === "No" ? "default" : "outline"}
                  onClick={() => setIsForSale("No")}
                  className="w-20 h-12 text-base"
                >
                  No
                </Button>
              </div>
              <span className="text-[12px] text-neutral-500 self-center">
                Only check this box if customers can access, use, or buy your{" "}
                <br />
                product today.
              </span>
            </div>
          </div>

          {/* Is your company generating revenue?*/}
          <div className="space-y-5">
            <Label htmlFor="companyName" className="font-bold text-lg">
              Is your company generating revenue?
            </Label>
            <div className="flex space-x-5">
              <div className="flex space-x-2 w-96">
                <Button
                  variant={isGeneratingRevenue === "Yes" ? "default" : "outline"}
                  onClick={() => setIsGeneratingRevenue("Yes")}
                  className="w-20 h-12 text-base"
                >
                  Yes
                </Button>
                <Button
                  variant={isGeneratingRevenue === "No" ? "default" : "outline"}
                  onClick={() => setIsGeneratingRevenue("No")}
                  className="w-20 h-12 text-base"
                >
                  No
                </Button>
              </div>
              <span className="text-[12px] text-neutral-500 self-center">
                Only check this box if your company is making money. <br />
                Please elaborate on revenue and other traction below.
              </span>
            </div>
          </div>

          {/* Pitch deck */}
          <div className="space-y-5">
            <Label htmlFor="companyName" className="font-bold text-lg">
              Pitch Deck
            </Label>
            <div className="flex space-x-2 w-96">
              <Button
                variant={businessPitch === "text" ? "default" : "outline"}
                onClick={() => setBusinessPitch("text")}
                className="w-32 h-12 text-base"
              >
                Paste URL
              </Button>
              <Button
                variant={businessPitch === "file" ? "default" : "outline"}
                onClick={() => setBusinessPitch("file")}
                className="w-32 h-12 text-base"
              >
                Upload a file
              </Button>
            </div>
            <div className="flex space-x-5">
              <Input
                type={businessPitch}
                id="companyName"
                className="w-96"
                placeholder="https:// "
              />
              <span className="text-[12px] text-neutral-500 self-center">
                Your pitch deck and other application info will be used for{" "}
                <br />
                internal purposes only. <br />
                Please make sure this document is publicly accessible. This can{" "}
                <br />
                be a DocSend, Box, Dropbox, Google Drive or other link.
              </span>
            </div>
          </div>

          {/* What's the rough size of your community? */}
          <div className="mt-10 space-y-5">
            <Label htmlFor="industry" className="font-bold text-lg mt-10">
              What{"'"}s the rough size of your <br /> community?
            </Label>
            <div className="flex space-x-5">
              <Select onValueChange={(value) => setSelectedCommunitySize(value)}>
                <SelectTrigger className="w-96">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select</SelectLabel>
                    {communitySize.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span className="text-[12px] text-neutral-500 self-center">
                Include your email list, social media following (i.e. Instagram,{" "}
                <br /> Discord, Facebook, Twitter, TikTok). We’d like to
                understand the <br /> rough size of your current audience.
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Submit */}
      <center>
        <Button onClick={submitApplication} className="mt-12 mb-20 h-10 text-base font-bold py-6 px-5">
          Submit Application
        </Button>
      </center>
    </div>
  );
}
