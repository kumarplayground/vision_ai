
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Sparkles,
  LoaderCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { JobDetailsClient } from './job-details-client';
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import type { IJob } from '@/models/Job';

async function getJob(id: string): Promise<IJob | null> {
  try {
    await dbConnect();
    const job = await Job.findById(id);
    if (!job) {
      return null;
    }
    // Convert Mongoose document to plain object
    return JSON.parse(JSON.stringify(job));
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return null;
  }
}

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button asChild variant="ghost">
              <Link href="/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-8 rounded-lg border bg-card p-6 sm:p-8">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
                   <div className="mt-2 flex flex-col gap-2 text-muted-foreground sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> {job.company}
                      </div>
                      <span className="hidden sm:inline">·</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {job.location}
                      </div>
                    </div>
                </div>
                 {job.companyLogo && (
                  <Image
                    src={job.companyLogo}
                    alt={`${job.company} logo`}
                    width={80}
                    height={80}
                    className="hidden rounded-md border object-contain sm:block"
                    data-ai-hint="company logo"
                  />
                )}
              </div>

              <div>
                <h2 className="mb-3 text-xl font-semibold">Job Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              <JobDetailsClient description={job.description} applyLink={job.applyLink} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
