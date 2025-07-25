import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
              Terms & Conditions
            </h1>
            <div className="prose prose-lg text-muted-foreground">
              <p>
                Welcome to CareerJugaad. By accessing our website, you agree to be bound by these Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
              <p>
                The materials contained in this website are protected by applicable copyright and trademark law. Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}