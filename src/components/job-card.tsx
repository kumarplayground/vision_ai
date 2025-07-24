
"use client";

import Image from "next/image";
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Briefcase,
  MapPin,
} from "lucide-react";
import type { Job } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
      <Card className="flex h-full flex-col transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <CardDescription className="!mt-1 flex items-center gap-2 pt-1 text-sm">
                <Briefcase className="h-4 w-4" /> {job.company}
              </CardDescription>
            </div>
            {job.companyLogo && (
              <Image
                src={job.companyLogo}
                alt={`${job.company} logo`}
                width={48}
                height={48}
                className="rounded-md object-contain"
                data-ai-hint="company logo"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Badge variant="outline">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</Badge>
          <Button asChild>
            <Link href={`/jobs/${job._id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
  );
}
