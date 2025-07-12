import { jobs } from "@/lib/data";
import { JobsTable } from "@/components/admin/jobs-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AdminJobsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Jobs</h1>
          <p className="mt-2 text-muted-foreground">
            Here you can add, edit, or delete job postings.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Job
        </Button>
      </div>
      <div className="mt-8">
        <JobsTable jobs={jobs} />
      </div>
    </div>
  );
}
