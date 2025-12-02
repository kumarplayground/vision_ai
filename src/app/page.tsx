
import Link from "next/link";
import { ArrowRight, Briefcase, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OmniSearch } from "@/components/omni-search";
import Course from "@/models/Course";
import dbConnect from "@/lib/mongodb";
import { unstable_noStore as noStore } from 'next/cache';

async function getLatestCourses() {
  noStore();
  try {
    await dbConnect();
    const courses = await Course.find({}).sort({ createdAt: -1 }).limit(6);
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error("Failed to fetch latest courses:", error);
    return [];
  }
}

export default async function Home() {
  const latestCourses = await getLatestCourses();

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <div className="flex flex-col gap-16 md:gap-24">
          <section className="relative container mx-auto px-4 py-16 text-center sm:py-24">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
              A Vision To Make{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                India Smarter
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200 md:text-xl">
              Learn. Grow. Succeed with AI to Shape the Future.
            </p>
            <div className="mt-8 w-full px-4">
              <OmniSearch />
            </div>
          </section>

          <section className="container mx-auto px-4 pb-16 sm:pb-24">
            <div className="relative text-center">
              <h2 className="text-3xl font-bold tracking-tight">Explore AI</h2>
               <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
               Explore Our Latest AI Courses and Learning Opportunities.
              </p>
              <Button
                asChild
                variant="link"
                className="text-primary absolute -top-1 right-0 hidden sm:inline-flex"
              >
                <Link href="/courses">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestCourses.map((course: any) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/courses">Load More Courses</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
