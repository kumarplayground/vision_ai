import { JobForm } from "@/components/admin/job-form";

export default function NewJobPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Job</h1>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below to create a new job posting.
          </p>
        </div>
        <JobForm />
      </div>
    </div>
  );
}
