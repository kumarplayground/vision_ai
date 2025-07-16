"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createCourse, updateCourse } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, LoaderCircle } from "lucide-react";
import type { Course } from "@/types";

const initialState = {
  message: "",
  errors: null,
};

function getInitialThumbnailType(thumbnail?: string): "url" | "upload" {
  if (!thumbnail) return "url";
  if (thumbnail.startsWith("data:image")) return "upload";
  return "url";
}

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

  const [thumbnailType, setThumbnailType] = useState<"url" | "upload">(
    getInitialThumbnailType(course?.thumbnail)
  );
  const [thumbnailValue, setThumbnailValue] = useState(course?.thumbnail || "");

  useEffect(() => {
    if (state.message === "success") {
      router.push("/admin/courses");
    }
  }, [state.message, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          <input type="hidden" name="id" value={course?._id} />
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" name="title" defaultValue={course?.title} required />
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
              defaultValue={course?.description}
              required
            />
            {state.errors?.description && (
              <p className="text-sm text-destructive">
                {state.errors.description[0]}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <Label>Thumbnail</Label>
            <RadioGroup
              value={thumbnailType}
              onValueChange={(value: "url" | "upload") =>
                setThumbnailType(value)
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
            {thumbnailType === "url" ? (
              <Input
                id="thumbnail-url"
                name="thumbnail-url"
                placeholder="https://placehold.co/600x400"
                required={thumbnailType === 'url'}
                onChange={(e) => setThumbnailValue(e.target.value)}
                value={thumbnailValue.startsWith('data:image') ? '' : thumbnailValue}
                disabled={thumbnailType !== 'url'}
              />
            ) : (
              <Input
                type="file"
                id="thumbnail-file"
                name="thumbnail-file"
                accept="image/*"
                required={thumbnailType === 'upload' && !thumbnailValue.startsWith('data:image')}
                onChange={handleFileChange}
                disabled={thumbnailType !== 'upload'}
              />
            )}
            <input type="hidden" name="thumbnail" value={thumbnailValue} />
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
              defaultValue={course?.buyLink}
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
