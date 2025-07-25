
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
              About Us
            </h1>
            <div className="prose prose-lg text-muted-foreground">
              <p>
                Welcome to CareerJugaad. Our mission is to bridge the gap between talent and opportunity. We believe that everyone deserves a chance to build a meaningful career, and we are dedicated to providing the resources and guidance needed to navigate the modern job market.
              </p>
              <p>
                From curated job listings to skill-enhancing courses, our platform is designed to empower you at every step of your professional journey. We are passionate about helping you find not just a job, but a career that you love.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
