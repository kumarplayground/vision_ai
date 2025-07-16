"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createJob, updateJob } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, LoaderCircle } from "lucide-react";
import type { Job } from "@/types";

const initialState = {
  message: "",
  errors: null,
};

function getInitialLogoType(logo?: string): "url" | "upload" {
  if (!logo) return "url";
  if (logo.startsWith("data:image")) return "upload";
  return "url";
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      {isEditing ? "Update Job" : "Create Job"}
    </Button>
  );
}

export function JobForm({ job }: { job?: Job }) {
  const isEditing = !!job;
  const action = isEditing ? updateJob : createJob;
  const [state, formAction] = useActionState(action, initialState);
  const router = useRouter();
  
  const [logoType, setLogoType] = useState<"url" | "upload">(
    getInitialLogoType(job?.companyLogo)
  );
  const [logoValue, setLogoValue] = useState(job?.companyLogo || "");

  useEffect(() => {
    if (state.message === "success") {
      router.push("/admin/jobs");
    }
  }, [state.message, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          <input type="hidden" name="id" value={job?._id} />
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" name="title" defaultValue={job?.title} required />
            {state.errors?.title && (
              <p className="text-sm text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              defaultValue={job?.company}
              required
            />
            {state.errors?.company && (
              <p className="text-sm text-destructive">
                {state.errors.company[0]}
              </p>
            )}
          </div>
           <div className="space-y-4">
            <Label>Company Logo</Label>
            <RadioGroup
              value={logoType}
              onValueChange={(value: "url" | "upload") =>
                setLogoType(value)
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url">URL</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload">Upload</Label>
              </div>
            </RadioGroup>
            {logoType === "url" ? (
              <Input
                id="companyLogo-url"
                name="companyLogo-url"
                placeholder="https://placehold.co/100x100"
                required={logoType === 'url'}
                onChange={(e) => setLogoValue(e.target.value)}
                value={logoValue.startsWith('data:image') ? '' : logoValue}
                disabled={logoType !== 'url'}
              />
            ) : (
              <Input
                type="file"
                id="companyLogo-file"
                name="companyLogo-file"
                accept="image/*"
                required={logoType === 'upload' && !logoValue.startsWith('data:image')}
                onChange={handleFileChange}
                disabled={logoType !== 'upload'}
              />
            )}
            <input type="hidden" name="companyLogo" value={logoValue} />
            {state.errors?.companyLogo && (
              <p className="text-sm text-destructive">
                {state.errors.companyLogo[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              defaultValue={job?.location}
              required
            />
            {state.errors?.location && (
              <p className="text-sm text-destructive">
                {state.errors.location[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={8}
              defaultValue={job?.description}
              required
            />
            {state.errors?.description && (
              <p className="text-sm text-destructive">
                {state.errors.description[0]}
              </p>
            )}
          </div>
           <div className="space-y-2">
            <Label htmlFor="applyLink">Apply Link</Label>
            <Input id="applyLink" name="applyLink" defaultValue={job?.applyLink} required />
            {state.errors?.applyLink && (
              <p className="text-sm text-destructive">{state.errors.applyLink[0]}</p>
            )}
          </div>
          {state.message && state.message !== "success" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </Card>
    </form>
  );
}