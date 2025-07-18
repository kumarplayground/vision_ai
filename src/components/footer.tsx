
import Link from "next/link";
import { Briefcase, Facebook, X, Instagram, Linkedin, Youtube, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5 lg:col-span-4">
             <Link href="/" className="mb-4 flex items-center space-x-2 text-xl font-bold">
              <Briefcase className="h-7 w-7 text-primary" />
              <span className="text-foreground">CareerJugaad</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Your guide to the next step in your career. Find jobs and courses to boost your skills.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <X className="h-6 w-6" />
                <span className="sr-only">X</span>
              </a>
              <a href="https://www.instagram.com/earnwithsuziie/?igsh=MTllMjhieTN4dHAxNQ%3D%3D&utm_source=qr#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://www.youtube.com/@SuziieVlogs" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </a>
              <a href="https://t.me/careerjugaaad" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Send className="h-6 w-6" />
                <span className="sr-only">Telegram</span>
              </a>
            </div>
          </div>
          <div className="md:col-span-7 lg:col-span-8 md:justify-self-end">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
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
                <h3 className="font-semibold text-foreground">Support</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link href="/help" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
                  <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                  <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policies</Link></li>
                  <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                </ul>
              </div>
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
