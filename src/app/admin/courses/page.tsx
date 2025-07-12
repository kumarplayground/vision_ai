import { courses } from "@/lib/data";
import { AdminPage } from "@/components/admin/admin-page";
import { CoursesTable } from "@/components/admin/courses-table";

export default function AdminCoursesPage() {
  return (
    <AdminPage
      title="Manage Courses"
      description="Here you can add, edit, or delete courses."
      buttonText="Add New Course"
    >
      <CoursesTable courses={courses} />
    </AdminPage>
  );
}
