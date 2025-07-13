"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { jobs } from "./data";
import { summarizeJobDescription } from "@/ai/flows/job-description-summarizer";

export async function getJobSummary(
  description: string
): Promise<{ summary?: string; error?: string }> {
  if (!description) {
    return { error: "Job description is empty." };
  }

  try {
    const result = await summarizeJobDescription({
      jobDescription: description,
    });
    return { summary: result.summary };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate summary. Please try again." };
  }
}

const JobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  company: z.string().min(2, "Company must be at least 2 characters long."),
  location: z.string().min(2, "Location must be at least 2 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
});

type FormState = {
  message: string;
  errors?: {
    title?: string[];
    company?: string[];
    location?: string[];
    description?: string[];
  } | null;
}

export async function createJob(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = JobSchema.safeParse({
    title: formData.get("title"),
    company: formData.get("company"),
    location: formData.get("location"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const newJob = {
      id: String(Date.now()),
      ...validatedFields.data,
      postedAt: "Just now",
      applyLink: "#",
    };

    // Add the new job to the beginning of the array
    jobs.unshift(newJob);

    revalidatePath("/");
    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");

    return { message: "success" };

  } catch (error) {
    console.error("Failed to create job:", error);
    return { message: "An unexpected error occurred. Please try again.", errors: null };
  }
}
