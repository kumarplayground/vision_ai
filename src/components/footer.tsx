
import Link from "next/link";
import { Facebook, X, Instagram, Linkedin, Youtube, Send } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1e3a8a] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
             <Link href="/" className="mb-4 flex items-center space-x-2 text-xl font-bold">
              <Image src="https://res.cloudinary.com/dvb1b2vgi/image/upload/vision_logo_vc5fql.jpg" alt="vision.ai logo" width={32} height={32} className="rounded-full" />
              <span className="text-white">vision.ai</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Your guide to the next step in your career. Find jobs and courses to boost your skills.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary">
                <X className="h-6 w-6" />
                <span className="sr-only">X</span>
              </a>
              <a href="https://www.instagram.com/learnwithsuzie?igsh=dGR5NHp0bml2d3Q5">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://www.youtube.com/@SuziieVlogs" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary">
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </a>
              <a href="https://t.me/careerjugaaad" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary">
                <Send className="h-6 w-6" />
                <span className="sr-only">Telegram</span>
              </a>
            </div>
          </div>
          <div className="md:col-span-3">
             <h3 className="font-semibold text-white">Quick Links</h3>
             <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-300 hover:text-primary">About Us</Link></li>
                <li><Link href="/disclaimer" className="text-gray-300 hover:text-primary">Disclaimer</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-primary">Terms & Conditions</Link></li>
             </ul>
          </div>
           <div className="md:col-span-3">
            <h3 className="font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/help" className="text-gray-300 hover:text-primary">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-primary">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} vision.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
