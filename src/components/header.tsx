import { HeaderClient } from "./header-client";

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/courses", label: "Courses" },
];

export function Header() {
  return (
    <HeaderClient navLinks={navLinks} />
  );
}
