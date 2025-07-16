import { CourseForm } from "@/components/admin/course-form";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import { notFound } from "next/navigation";

async function getCourse(id: string) {
  try {
    await dbConnect();
    const course = await Course.findById(id);
    if (!course) {
      return null;
    }
    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);

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
