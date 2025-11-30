
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Image from 'next/image';

import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";

interface NavLink {
    href: string;
    label: string;
}

interface HeaderClientProps {
    navLinks: NavLink[];
}

export function HeaderClient({ navLinks }: HeaderClientProps) {
  const pathname = usePathname();
  const isAdminLoginPage = pathname === "/admin/login";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        {
          "hidden": isAdminLoginPage
        }
      )}
    >
      <div className="container mx-auto max-w-full px-4 flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="https://res.cloudinary.com/dvb1b2vgi/image/upload/vision_logo_vc5fql.jpg" alt="vision.ai logo" width={32} height={32} className="rounded-full"/>
            <span className="hidden font-bold sm:inline-block">
              vision.ai
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="flex-1 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 p-4">
                <Link href="/" className="flex items-center space-x-2">
                  <Image src="https://res.cloudinary.com/dvb1b2vgi/image/upload/vision_logo_vc5fql.jpg" alt="vision.ai logo" width={32} height={32} className="rounded-full"/>
                  <span className="font-bold">vision.ai</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map(({ href, label }) => (
                    <SheetClose key={href} asChild>
                      <Link
                        href={href}
                        className={cn(
                          "text-lg font-medium transition-colors hover:text-foreground/80",
                          pathname === href
                            ? "text-foreground"
                            : "text-foreground/60"
                        )}
                      >
                        {label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
