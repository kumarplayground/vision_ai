
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
              Help Center
            </h1>
            <div className="prose prose-lg text-muted-foreground">
              <p>
                Welcome to the Help Center. Here you can find answers to frequently asked questions and get support for our services.
              </p>
              <p>
                If you cannot find an answer to your question, please feel free to reach out to us through our Contact Us page.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
