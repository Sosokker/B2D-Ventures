import { z } from "zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const imageSchema = z
  .custom<File>((val) => val && typeof val === "object" && "size" in val && "type" in val, {
    message: "Input must be a file.",
  })
  .refine((file) => file.size < MAX_FILE_SIZE, {
    message: "File can't be bigger than 5MB.",
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "File format must be either jpg, jpeg, or png.",
  });

const projectFormSchema = z.object({
  projectName: z.string().min(5, {
    message: "Project name must be at least 5 characters.",
  }),
  projectType: z.number({
    required_error: "Please select one of the option",
  }),
  shortDescription: z
    .string({
      required_error: "Please provide a brief description for your project",
    })
    .min(10, {
      message: "Short description must be at least 10 characters.",
    }),
  projectPitchDeck: z.union([
    z.string().url("Pitch deck must be a valid URL."),
    z
      .custom<File>((val) => val instanceof File, {
        message: "Input must be a file.",
      })
      .refine((file) => file.size < MAX_FILE_SIZE, {
        message: "File can't be bigger than 5MB.",
      })
      .refine((file) => file.name.endsWith(".md"), {
        message: "File must be a markdown file (.md).",
      }),
  ]),
  projectLogo: imageSchema,
  projectPhotos: z.custom(
    (value) => {
      if (value instanceof FileList || Array.isArray(value)) {
        return value.length > 0 && Array.from(value).every((item) => item instanceof File);
      }
      return false;
    },
    {
      message: "Must be a FileList or an array of File objects with at least one file.",
    }
  ),

  minInvest: z
    .number({
      required_error: "Minimum investment must be a number.",
      invalid_type_error: "Minimum investment must be a valid number.",
    })
    .positive()
    .max(9999999999, "Minimum investment must be a realistic amount."),
  targetInvest: z
    .number({
      required_error: "Target investment must be a number.",
      invalid_type_error: "Target investment must be a valid number.",
    })
    .positive()
    .max(9999999999, "Target investment must be a realistic amount."),
  deadline: z
    .string()
    .min(1, "Deadline is required.")
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date-time format.",
    })
    .transform((value) => new Date(value))
    .refine((date) => date > new Date(), {
      message: "Deadline must be in the future.",
    }),
  tag: z.array(z.number()).min(1, "Please provide at least one tag.").max(5, "You can provide up to 5 tags."),
});

const businessFormSchema = z.object({
  companyName: z.string().min(5, {
    message: "Company name must be at least 5 characters.",
  }),
  industry: z.number({
    required_error: "Please select one of the option",
  }),
  isInUS: z
    .string({
      required_error: "Please select either 'Yes' or 'No'.",
    })
    .transform((val) => val.toLowerCase())
    .refine((val) => val === "yes" || val === "no", {
      message: "Please select either 'Yes' or 'No'.",
    }),
  isForSale: z
    .string({
      required_error: "Please select either 'Yes' or 'No'.",
    })
    .transform((val) => val.toLowerCase())
    .refine((val) => val === "yes" || val === "no", {
      message: "Please select either 'Yes' or 'No'.",
    }),
  isGenerating: z
    .string({
      required_error: "Please select either 'Yes' or 'No'.",
    })
    .transform((val) => val.toLowerCase())
    .refine((val) => val === "yes" || val === "no", {
      message: "Please select either 'Yes' or 'No'.",
    }),
  totalRaised: z
    .number({
      required_error: "Total raised must be a number.",
      invalid_type_error: "Total raised must be a valid number.",
    })
    .positive()
    .max(9999999999, "Total raised must be a realistic amount."),
  communitySize: z.string({
    required_error: "Please select one of the option",
  }),
  businessPitchDeck: z.union([
    z
      .string()
      .url("Pitch deck must be a valid URL.")
      .refine((url) => url.endsWith(".md"), {
        message: "Pitch deck URL must link to a markdown file (.md).",
      }),
    z
      .custom<File>((val) => val instanceof File, {
        message: "Input must be a file.",
      })
      .refine((file) => file.size < MAX_FILE_SIZE, {
        message: "File can't be bigger than 5MB.",
      })
      .refine((file) => file.name.toLowerCase().endsWith(".md"), {
        message: "File must be a markdown file (.md).",
      }),
  ]),
  country: z.string({
    required_error: "Please select one of the option",
  }),
});

export { businessFormSchema, projectFormSchema };
