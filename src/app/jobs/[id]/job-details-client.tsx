
"use client";

import { useState } from 'react';
import {
  ExternalLink,
  Sparkles,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { getJobSummary } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface JobDetailsClientProps {
  description: string;
  applyLink: string;
}

export function JobDetailsClient({ description, applyLink }: JobDetailsClientProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setError("");
    setSummary("");
    setIsLoading(true);
    const result = await getJobSummary(description);
    if (result.summary) {
      setSummary(result.summary);
    } else if (result.error) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-6 space-y-6 border-t pt-6">
      <div className="flex flex-col gap-4 sm:flex-row">
         <Button onClick={handleSummarize} disabled={true || isLoading}>
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
               Summarize with AI (Temporarily Disabled)
            </>
          )}
        </Button>
        <Button asChild variant="secondary">
          <a href={applyLink} target="_blank" rel="noopener noreferrer">
            Apply Now <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

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
  )
}
