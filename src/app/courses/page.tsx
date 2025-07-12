import { CourseCard } from "@/components/course-card";
import { Header } from "@/components/header";
import { courses } from "@/lib/data";

export default function CoursesPage() {
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
    </div>
  );
}
