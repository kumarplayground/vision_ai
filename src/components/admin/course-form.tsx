
"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { createCourse, updateCourse } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LoaderCircle, UploadCloud } from "lucide-react";
import type { Course } from "@/types";
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
      {isEditing ? "Update Course" : "Create Course"}
    </Button>
  );
}

export function CourseForm({ course }: { course?: Course }) {
  const isEditing = !!course;
  const action = isEditing ? updateCourse : createCourse;
  const [state, formAction] = useActionState(action, initialState);
  const router = useRouter();
  
  const [thumbnailValue, setThumbnailValue] = useState(course?.thumbnail || "");
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (state.message === "success") {
      router.push("/admin/courses");
    }
  }, [state.message, router]);

  const handleUploadSuccess = (result: any) => {
    if (result.event === 'success' && result.info) {
      setThumbnailValue(result.info.secure_url);
    }
  };

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          <input type="hidden" name="id" value={course?._id} />
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" name="title" defaultValue={course?.title || ""} required />
            {state.errors?.title && (
              <p className="text-sm text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={course?.description || ""}
              required
            />
            {state.errors?.description && (
              <p className="text-sm text-destructive">
                {state.errors.description[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
             <div className="flex items-center gap-4">
               <div className="w-full space-y-2">
                 <Input
                    name="thumbnail"
                    placeholder="Enter image URL"
                    value={thumbnailValue}
                    onChange={(e) => setThumbnailValue(e.target.value)}
                  />
                  <CldUploadButton
                    onSuccess={handleUploadSuccess}
                    uploadPreset={uploadPreset}
                    className="w-full"
                  >
                    <Button type="button" variant="outline" className="w-full">
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload from Computer
                    </Button>
                  </CldUploadButton>
               </div>
                {thumbnailValue && (
                    <Image
                      src={thumbnailValue}
                      alt="Thumbnail Preview"
                      width={80}
                      height={80}
                      className="rounded-lg border object-contain aspect-square"
                    />
                )}
             </div>
            {state.errors?.thumbnail && (
              <p className="text-sm text-destructive">
                {state.errors.thumbnail[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="buyLink">Course Link</Label>
            <Input
              id="buyLink"
              name="buyLink"
              placeholder="https://example.com/course"
              defaultValue={course?.buyLink || ""}
              required
            />
            {state.errors?.buyLink && (
              <p className="text-sm text-destructive">
                {state.errors.buyLink[0]}
              </p>
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
