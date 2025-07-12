import Link from "next/link";
import { ArrowRight, Briefcase, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { JobCard } from "@/components/job-card";
import { jobs, courses } from "@/lib/data";
import { Header } from "@/components/header";

export default function Home() {
  const latestJobs = jobs.slice(0, 3);
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <div className="flex flex-col gap-16 md:gap-24">
          <section className="container mx-auto px-4 py-16 text-center sm:py-24">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Navigate Your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Career Path
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Discover your next opportunity. Explore curated job listings and skill-enhancing courses designed for growth.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/jobs">
                  Explore Jobs <Briefcase className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/courses">
                  Browse Courses <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>

          <section className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Latest Jobs</h2>
              <Button asChild variant="link" className="text-primary">
                <Link href="/jobs">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>

          <section className="container mx-auto px-4 pb-16 sm:pb-24">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Featured Courses</h2>
              <Button asChild variant="link" className="text-primary">
                <Link href="/courses">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
