import { JobForm } from "@/components/admin/job-form";
import { jobs } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const job = jobs.find((j) => j.id === params.id);

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
