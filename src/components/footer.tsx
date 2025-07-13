import Link from "next/link";
import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
             <Link href="/" className="mb-4 flex items-center space-x-2 text-xl font-bold">
              <Briefcase className="h-7 w-7 text-primary" />
              <span className="text-foreground">CareerJugaad</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Your guide to the next step in your career. Find jobs and courses to boost your skills.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/disclaimer" className="text-muted-foreground hover:text-primary">Disclaimer</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map((social) => (
                <Button key={social.label} asChild variant="ghost" size="icon">
                  <a href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CareerJugaad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
