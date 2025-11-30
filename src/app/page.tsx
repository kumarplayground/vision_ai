
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
import Image from "next/image";

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

const CompanyLogo = ({ children }: { children: React.ReactNode }) => (
  <li className="flex-shrink-0">
    <div className="relative h-28 w-40 mx-4 flex items-center justify-center">
      {children}
    </div>
  </li>
);

const companies = [
  { 
    name: 'Partner 1', 
    logo: <Image src="https://res.cloudinary.com/dvb1b2vgi/image/upload/v1762154044/IMG_2908_twmnr6.jpg" alt="Partner 1" fill className="object-contain rounded-lg" sizes="160px" /> 
  },
  { 
    name: 'Partner 2', 
    logo: <Image src="https://res.cloudinary.com/dvb1b2vgi/image/upload/v1762154043/IMG_2905_cjgq76.jpg" alt="Partner 2" fill className="object-contain rounded-lg" sizes="160px" /> 
  },
  { 
    name: 'Partner 3', 
    logo: <Image src="https://res.cloudinary.com/dvb1b2vgi/image/upload/v1762154043/IMG_2910_qbkeet.jpg" alt="Partner 3" fill className="object-contain rounded-lg" sizes="160px" /> 
  },
  { 
    name: 'Partner 4', 
    logo: <Image src="https://res.cloudinary.com/dvb1b2vgi/image/upload/v1762154043/IMG_2907_i62r1f.jpg" alt="Partner 4" fill className="object-contain rounded-lg" sizes="160px" /> 
  },
  { 
    name: 'Partner 5', 
    logo: <Image src="https://res.cloudinary.com/dvb1b2vgi/image/upload/v1762154042/IMG_2900_to3nx8.jpg" alt="Partner 5" fill className="object-contain rounded-lg" sizes="160px" /> 
  },
  { 
    name: 'Partner 6', 
    logo: <Image src="https://res.cloudinary.com/dvb1b2vgi/image/upload/v1762154042/IMG_2902_fwydth.jpg" alt="Partner 6" fill className="object-contain rounded-lg" /> 
  }
];

export default async function Home() {
  const latestCourses = await getLatestCourses();

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <div className="flex flex-col gap-16 md:gap-24">
          <section className="relative container mx-auto px-4 py-16 text-center sm:py-24">
            <Image
              src="https://res.cloudinary.com/dvb1b2vgi/image/upload/bg1_up8iob.jpg"
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 -z-10"
              data-ai-hint="background"
            />
            <div className="absolute inset-0 -z-10 bg-black/50" />
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

          <section className="py-12 sm:py-16 bg-card">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">
                Trusted by Leading EdTech and AI Innovators.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Proudly Collaborated with Industry Leaders.
                </p>
              </div>
              <div className="relative mt-12 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                <ul className="flex w-max animate-marquee items-center [--duration:30s] hover:[animation-play-state:paused]">
                  {[...companies, ...companies].map((company, index) => (
                    <CompanyLogo key={index}>{company.logo}</CompanyLogo>
                  ))}
                </ul>
              </div>
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
