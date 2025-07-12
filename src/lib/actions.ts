"use server";

import { summarizeJobDescription } from "@/ai/flows/job-description-summarizer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export async function login(prevState: { error: string } | undefined, formData: FormData) {
  const password = formData.get("password");
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = cookies();
    cookieStore.set("token", "admin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // One week
      path: "/",
    });
    redirect("/admin");
  } else {
    return { error: "Invalid password." };
  }
}

export async function logout() {
    const cookieStore = cookies();
    cookieStore.delete('token');
    redirect('/login');
}
