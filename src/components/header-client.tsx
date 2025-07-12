"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Menu, LogIn, Shield } from "lucide-react";

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
    isLoggedIn: boolean;
    navLinks: NavLink[];
}

export function HeaderClient({ isLoggedIn, navLinks }: HeaderClientProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  const adminLinkHref = isLoggedIn ? "/admin" : "/login";
  const adminLinkLabel = isLoggedIn ? "Admin" : "Login";
  const AdminLinkIcon = isLoggedIn ? Shield : LogIn;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        {
          hidden: isAdminRoute,
        }
      )}
    >
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              CareerPath Navigator
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
            <Link
              href={adminLinkHref}
              className={cn(
                "transition-colors hover:text-foreground/80 flex items-center gap-1",
                pathname.startsWith("/admin") || pathname === "/login"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {adminLinkLabel}
              <AdminLinkIcon className="h-4 w-4" />
            </Link>
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
                  <Briefcase className="h-6 w-6 text-primary" />
                  <span className="font-bold">CareerPath Navigator</span>
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
                  <SheetClose asChild>
                    <Link
                      href={adminLinkHref}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-foreground/80 flex items-center gap-2",
                        pathname.startsWith("/admin") || pathname === "/login"
                          ? "text-foreground"
                          : "text-foreground/60"
                      )}
                    >
                      {adminLinkLabel} <AdminLinkIcon className="h-5 w-5" />
                    </Link>
                  </SheetClose>
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
