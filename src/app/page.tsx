
import Link from "next/link";
import { ArrowRight, Briefcase, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Job from "@/models/Job";
import dbConnect from "@/lib/mongodb";
import { unstable_noStore as noStore } from 'next/cache';

async function getLatestJobs() {
  noStore();
  try {
    await dbConnect();
    const jobs = await Job.find({}).sort({ createdAt: -1 }).limit(6);
    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.error("Failed to fetch latest jobs:", error);
    return [];
  }
}

const CompanyLogo = ({ children }: { children: React.ReactNode }) => (
  <li className="flex-shrink-0">
    <div className="flex items-center justify-center h-16 w-40 text-muted-foreground">
      {children}
    </div>
  </li>
);

const companies = [
  { name: 'Innovate Inc.', logo: <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24ZM34.2857 24V0H42.8571V24H34.2857ZM58.7143 4.28571L51.4286 24H66L73.2857 4.28571L58.7143 4.28571ZM88 12L76 24H100L88 12Z" fill="currentColor"/></svg> },
  { name: 'TechCorp', logo: <svg width="90" height="24" viewBox="0 0 90 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 24H8.57143V8.57143H17.1429V24H25.7143V0H0V24ZM34.2857 24H42.8571V0H34.2857V24ZM51.4286 24H60V0H51.4286V24ZM68.5714 24H77.1429L81.4286 12L85.7143 24H90L81.4286 0H77.1429L68.5714 24Z" fill="currentColor"/></svg> },
  { name: 'Solutions Ltd.', logo: <svg width="110" height="24" viewBox="0 0 110 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24H20V0H12ZM42 24H32V0H42V24ZM62 24H52V0H62V24ZM82 24H72V0H82V24ZM102 24H92V0H102C106.418 0 110 3.58172 110 8V16C110 20.4183 106.418 24 102 24Z" fill="currentColor"/></svg> },
  { name: 'Quantum IT', logo: <svg width="95" height="24" viewBox="0 0 95 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 24V0H8.57143V15.4286H17.1429V0H25.7143V24H0ZM42.8571 24V0H34.2857V24H42.8571ZM60 24H51.4286V0H68.5714V8.57143H60V24ZM95 0H77.1429V24H85.7143V8.57143H95V0Z" fill="currentColor"/></svg> },
  { name: 'NextGen', logo: <svg width="105" height="24" viewBox="0 0 105 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0V24H8.57143L17.1429 8.57143V24H25.7143V0H17.1429L8.57143 15.4286V0H0ZM34.2857 24H42.8571V0H34.2857V24ZM60 24H51.4286V0H60V24ZM77.1429 24H85.7143V0H77.1429V24ZM105 12C105 18.6274 100.274 24 93.5714 24H88V0H93.5714C100.274 0 105 5.37258 105 12Z" fill="currentColor"/></svg> },
  { name: 'Synergy', logo: <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24V12H24C18.6274 12 12 6.62742 12 0ZM34.2857 24H42.8571V0H34.2857V24ZM58.7143 4.28571L51.4286 24H66L73.2857 4.28571L58.7143 4.28571ZM80 12C80 5.37258 74.6274 0 68 0H64V24H68C74.6274 24 80 18.6274 80 12Z" fill="currentColor"/></svg> }
];

export default async function Home() {
  const latestJobs = await getLatestJobs();

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <div className="flex flex-col gap-16 md:gap-24">
          <section className="relative container mx-auto px-4 py-16 text-center sm:py-24">
            <div
              className="absolute inset-0 -z-10 bg-radial-gradient(ellipse_at_center,var(--tw-gradient-stops)) from-primary to-primary/30 to-70% blur-3xl"
              aria-hidden="true"
            />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Navigate Your{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                Career Path
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl">
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

          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">
                  Trusted by leading companies
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                  Join thousands of active jobs listed by trusted companies.
                </p>
              </div>
              <div className="relative mt-12 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                <ul className="flex w-max animate-marquee items-center [--duration:40s] hover:[animation-play-state:paused]">
                  {[...companies, ...companies].map((company, index) => (
                    <CompanyLogo key={index}>{company.logo}</CompanyLogo>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 pb-16 sm:pb-24">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Latest Jobs</h2>
              <Button asChild variant="link" className="text-primary">
                <Link href="/jobs">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestJobs.map((job: any) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link href="/jobs">Load More Jobs</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
