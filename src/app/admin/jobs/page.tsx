
import { JobsTable } from "@/components/admin/jobs-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import Job from "@/models/Job";
import dbConnect from "@/lib/mongodb";
import { unstable_noStore as noStore } from 'next/cache';

async function getJobs() {
  noStore();
  try {
    await dbConnect();
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

export default async function AdminJobsPage() {
  const jobs = await getJobs();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Jobs</h1>
          <p className="mt-2 text-muted-foreground">
            Here you can add, edit, or delete job postings.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Job
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        <JobsTable jobs={jobs} />
      </div>
    </div>
  );
}
