"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from 'date-fns';
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Sparkles,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import type { Job } from "@/types";
import { getJobSummary } from "@/lib/actions";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setError("");
    setSummary("");
    setIsLoading(true);
    const result = await getJobSummary(job.description);
    if (result.summary) {
      setSummary(result.summary);
    } else if (result.error) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <Dialog>
      <Card className="flex h-full flex-col transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <CardDescription className="!mt-1 flex items-center gap-2 pt-1 text-sm">
                <Briefcase className="h-4 w-4" /> {job.company}
              </CardDescription>
            </div>
             <Image
              src={job.companyLogo}
              alt={`${job.company} logo`}
              width={48}
              height={48}
              className="rounded-md object-contain"
              data-ai-hint="company logo"
            />
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
          <DialogTrigger asChild>
            <Button variant="secondary">View Details</Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="max-w-2xl">
        <ScrollArea className="max-h-[80vh]">
          <div className="pr-6">
            <DialogHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                 <DialogTitle className="text-2xl">{job.title}</DialogTitle>
                  <DialogDescription className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> {job.company}
                    </div>
                    <span className="hidden sm:inline">·</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </div>
                  </DialogDescription>
                </div>
                <Image
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  width={64}
                  height={64}
                  className="rounded-md object-contain"
                  data-ai-hint="company logo"
                />
              </div>
            </DialogHeader>

            <div className="py-6">
              <h3 className="mb-2 text-lg font-semibold">Job Description</h3>
              <p className="text-sm text-muted-foreground">
                {job.description}
              </p>
            </div>

            <div className="space-y-4">
              <Button onClick={handleSummarize} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Summarize with AI
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {summary && (
                <Alert className="bg-accent/30">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">AI Summary</AlertTitle>
                  <AlertDescription>{summary}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button asChild className="w-full">
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
              Apply Now <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}