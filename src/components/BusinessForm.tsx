import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DualOptionSelector } from "@/components/dualSelector";
import { MultipleOptionSelector } from "@/components/multipleSelector";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { businessFormSchema } from "@/types/schemas/application.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type businessSchema = z.infer<typeof businessFormSchema>;

interface BusinessFormProps {
  industry: string[];
  handleSubmit: SubmitHandler<businessSchema>;
  onSubmit: () => void;
}
const BusinessForm = ({
  onSubmit,
  industry,
}: BusinessFormProps & { onSubmit: SubmitHandler<businessSchema> }) => {
  const communitySize = [
    "N/A",
    "0-5K",
    "5-10K",
    "10-20K",
    "20-50K",
    "50-100K",
    "100K+",
  ];
  const form = useForm<businessSchema>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {},
  });
  const [businessPitch, setBusinessPitch] = useState("text");
  const [businessPitchFile, setBusinessPitchFile] = useState("");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-flow-row auto-rows-max w-3/4 ml-1/2 lg:ml-[10%]">
          <h1 className="text-3xl font-bold mt-10 ml-96">About your company</h1>
          <p className="ml-96 mt-5 text-neutral-500">
            <span className="text-red-500 font-bold">**</span>All requested
            information in this section is required.
          </p>

          {/* Company Name */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Company name</FormLabel>
                <FormControl>
                  <Input placeholder="Your company name" {...field} />
                </FormControl>
                <FormDescription>
                  This should be the name your company uses on your website and
                  in the market.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Industry */}
          <FormField
            control={form.control}
            name="industry"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <MultipleOptionSelector
                    header={<>Industry</>}
                    fieldName="industry"
                    choices={industry}
                    handleFunction={(selectedValues: string) => {
                      field.onChange(selectedValues);
                    }}
                    description={
                      <>
                        Choose the industry that best aligns with your business.
                      </>
                    }
                    placeholder="Select an industry"
                    selectLabel="Industry"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Raised Money */}
          <FormField
            control={form.control}
            name="totalRaised"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  How much money has your company raised to date?
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="$ 1,000,000"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  The sum total of past financing, including angel or venture
                  capital, loans, grants, or token sales.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Incorporated in US */}
          <FormField
            control={form.control}
            name="isInUS"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Is your company incorporated in the United States?
                </FormLabel>
                <FormControl>
                  <DualOptionSelector
                    name="isInUS"
                    label={
                      <>Is your company incorporated in the United States?</>
                    }
                    choice1="Yes"
                    choice2="No"
                    handleFunction={(selectedValues: string) => {
                      // setIsInUS;
                      field.onChange(selectedValues);
                    }}
                    description={
                      <>
                        Only companies that are incorporated or formed in the US
                        are eligible to raise via Reg CF.
                      </>
                    }
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product for Sale */}
          <FormField
            control={form.control}
            name="isForSale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Is your product available (for sale) in market?
                </FormLabel>
                <FormControl>
                  <DualOptionSelector
                    name="isForSale"
                    value={field.value}
                    label={<>Is your product available (for sale) in market?</>}
                    choice1="Yes"
                    choice2="No"
                    handleFunction={(selectedValues: string) => {
                      // setIsForSale;
                      field.onChange(selectedValues);
                    }}
                    description={
                      <>
                        Only check this box if customers can access, use, or buy
                        your product today.
                      </>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Generating Revenue */}
          <FormField
            control={form.control}
            name="isGenerating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is your company generating revenue?</FormLabel>
                <FormControl>
                  <DualOptionSelector
                    name="isGenerating"
                    label={<>Is your company generating revenue?</>}
                    choice1="Yes"
                    choice2="No"
                    value={field.value}
                    handleFunction={(selectedValues: string) => {
                      // setIsGenerating;
                      field.onChange(selectedValues);
                    }}
                    description={
                      <>
                        Only check this box if your company is making money.
                        Please elaborate on revenue below.
                      </>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pitch Deck */}
          <FormField
            control={form.control}
            name="businessPitchDeck"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pitch deck</FormLabel>
                <FormControl>
                  <div className="flex space-x-2 w-96">
                    <Button
                      type="button"
                      variant={businessPitch === "text" ? "default" : "outline"}
                      onClick={() => setBusinessPitch("text")}
                      className="w-32 h-12 text-base"
                    >
                      Paste URL
                    </Button>
                    <Button
                      type="button"
                      variant={businessPitch === "file" ? "default" : "outline"}
                      onClick={() => setBusinessPitch("file")}
                      className="w-32 h-12 text-base"
                    >
                      Upload a file
                    </Button>
                    <Input
                      type={businessPitch === "file" ? "file" : "text"}
                      placeholder={
                        businessPitch === "file"
                          ? "Upload your Markdown file"
                          : "https:// "
                      }
                      accept={businessPitch === "file" ? ".md" : undefined}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      value={
                        businessPitch === "file" ? "" : (field.value as string)
                      }
                    />
                    {businessPitchFile && (
                      <div className="flex justify-between items-center border p-2 rounded w-96 text-sm text-foreground">
                        <span>1. {businessPitchFile}</span>
                        <Button
                          className="ml-4"
                          onClick={() => {
                            setBusinessPitchFile("");
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Community Size */}
          <FormField
            control={form.control}
            name="communitySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What's the rough size of your community?</FormLabel>
                <FormControl>
                  <MultipleOptionSelector
                    header={<>What's the rough size of your community?</>}
                    fieldName="communitySize"
                    choices={communitySize}
                    handleFunction={(selectedValues: string) => {
                      field.onChange(selectedValues);
                    }}
                    description={
                      <>
                        Include your email list, social media following (e.g.,
                        Instagram, Discord, Twitter).
                      </>
                    }
                    placeholder="Select"
                    selectLabel="Select"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apply for First Fundraising Project */}
          {/* <FormField
            control={form.control}
            name="applyProject"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex space-x-5">
                    <Switch
                      onCheckedChange={() => setApplyProject(!applyProject)}
                      {...field}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-[12px] text-neutral-500 self-center cursor-pointer">
                            Would you like to apply for your first fundraising
                            project as well?
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-[11px]">
                            Toggling this option allows you to begin your first
                            project, which is crucial for unlocking fundraising
                            tools.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
      </form>
    </Form>
  );
};

export default BusinessForm;
