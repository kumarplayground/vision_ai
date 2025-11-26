import { HeaderClient } from "./header-client";

const navLinks = [
  { href: "/chat", label: "AI Chat" },
  { href: "/jobs", label: "Jobs" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export function Header() {
  return (
    <HeaderClient navLinks={navLinks} />
  );
}
