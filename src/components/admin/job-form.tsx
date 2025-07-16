"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { createJob, updateJob } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LoaderCircle, UploadCloud } from "lucide-react";
import type { Job } from "@/types";
import Image from "next/image";

const initialState = {
  message: "",
  errors: null,
};

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
  
  const [logoValue, setLogoValue] = useState(job?.companyLogo || "");

  useEffect(() => {
    if (state.message === "success") {
      router.push("/admin/jobs");
    }
  }, [state.message, router]);

  const handleUploadSuccess = (result: any) => {
    setLogoValue(result.info.secure_url);
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
           <div className="space-y-2">
            <Label>Company Logo</Label>
             <div className="flex items-center gap-4">
               <div className="w-full space-y-2">
                 <Input
                    name="companyLogo"
                    placeholder="Enter image URL"
                    value={logoValue}
                    onChange={(e) => setLogoValue(e.target.value)}
                  />
                  <CldUploadButton
                    onSuccess={handleUploadSuccess}
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    className="w-full"
                  >
                    <Button type="button" variant="outline" className="w-full">
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload from Computer
                    </Button>
                  </CldUploadButton>
               </div>
                {logoValue && (
                    <Image
                      src={logoValue}
                      alt="Company Logo Preview"
                      width={80}
                      height={80}
                      className="rounded-lg border object-contain aspect-square"
                    />
                )}
             </div>
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
