"use server";

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
