
import { JobCard } from "@/components/job-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Job from "@/models/Job";
import dbConnect from "@/lib/mongodb";
import { unstable_noStore as noStore } from 'next/cache';

async function getJobs() {
  noStore();
  try {
    await dbConnect();
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    // Mongoose objects are not plain objects, so we need to serialize them
    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Find Your Next Opportunity
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Browse our curated list of jobs from top companies around the world.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
