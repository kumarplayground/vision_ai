import { CourseForm } from "@/components/admin/course-form";
import { courses } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
          <p className="mt-2 text-muted-foreground">
            Update the details for the course below.
          </p>
        </div>
        <CourseForm course={course} />
      </div>
    </div>
  );
}
