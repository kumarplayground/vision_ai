import Link from "next/link";
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
import { cookies } from "next/headers";
import { HeaderClient } from "./header-client";

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/courses", label: "Courses" },
];

export function Header() {
  const token = cookies().get("token")?.value;
  const isLoggedIn = token === "admin";

  return (
    <HeaderClient isLoggedIn={isLoggedIn} navLinks={navLinks} />
  );
}
