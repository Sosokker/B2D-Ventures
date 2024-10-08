"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Apply() {
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
        <div className="ml-96 mt-5">
          <Label htmlFor="companyName" className="font-bold text-lg">
            Company name
          </Label>
          <Input type="email" id="companyName" className="mt-2 w-96" />
        </div>
      </div>
    </div>
  );
}
