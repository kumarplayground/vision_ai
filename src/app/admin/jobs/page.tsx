import { jobs } from "@/lib/data";
import { AdminPage } from "@/components/admin/admin-page";
import { JobsTable } from "@/components/admin/jobs-table";

export default function AdminJobsPage() {
  return (
    <AdminPage
      title="Manage Jobs"
      description="Here you can add, edit, or delete job postings."
      buttonText="Add New Job"
    >
      <JobsTable jobs={jobs} />
    </AdminPage>
  );
}
