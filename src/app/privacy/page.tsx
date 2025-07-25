
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
              Privacy Policy
            </h1>
            <div className="prose prose-lg text-muted-foreground">
              <p>
                This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner.
              </p>
              <p>
                We may collect personal information such as your name, email address, and other contact details when you register on our site, place an order, subscribe to a newsletter, or fill out a form. We use this information to personalize your experience, improve our website, and provide customer service.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
