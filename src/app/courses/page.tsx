
import { CourseCard } from "@/components/course-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Course from "@/models/Course";
import dbConnect from "@/lib/mongodb";
import { unstable_noStore as noStore } from 'next/cache';

async function getCourses() {
  noStore();
  try {
    await dbConnect();
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Enhance Your Skills
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Invest in yourself with our collection of high-quality courses.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
