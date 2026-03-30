
import Link from "next/link";
import { ArrowRight, Briefcase, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/chat');
  return null;
}
