import { JobForm } from "@/components/admin/job-form";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { notFound } from "next/navigation";

async function getJob(id: string) {
  try {
    await dbConnect();
    const job = await Job.findById(id);
    if (!job) {
      return null;
    }
    return JSON.parse(JSON.stringify(job));
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return null;
  }
}

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Job</h1>
          <p className="mt-2 text-muted-foreground">
            Update the details for the job posting below.
          </p>
        </div>
        <JobForm job={job} />
      </div>
    </div>
  );
}
