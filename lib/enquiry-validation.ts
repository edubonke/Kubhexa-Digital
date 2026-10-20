import { z } from "zod";

export const projectTypes = ["Website", "App or business system", "UX and product design", "Not sure yet", "Other"] as const;
export const budgetRanges = ["Under R15,000", "R15,000 to R40,000", "R40,000 to R100,000", "R100,000+", "Help me scope it"] as const;
export const timelines = ["As soon as practical", "Within 1 to 3 months", "Within 3 to 6 months", "Exploring options"] as const;

export const enquirySchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(254).transform(v => v.toLowerCase()),
  company: z.string().trim().max(160).default(""),
  projectType: z.enum(projectTypes),
  budget: z.enum(budgetRanges),
  timeline: z.enum(timelines),
  brief: z.string().trim().min(20, "Tell us a little more (at least 20 characters).").max(4000, "Please keep your brief under 4,000 characters."),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree that we can use your details to respond." }) }),
  website: z.string().max(300).optional(),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
