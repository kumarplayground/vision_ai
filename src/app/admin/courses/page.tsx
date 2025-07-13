import { courses } from "@/lib/data";
import { CoursesTable } from "@/components/admin/courses-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AdminCoursesPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Here you can add, edit, or delete courses.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Course
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        <CoursesTable courses={courses} />
      </div>
    </div>
  );
}
