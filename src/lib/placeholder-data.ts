"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Course } from "@/types";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCourse } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface CoursesTableProps {
  courses: Course[];
}

export function CoursesTable({ courses }: CoursesTableProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const { toast } = useToast();

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (courseToDelete) {
      const result = await deleteCourse(courseToDelete._id);
      if (result.success) {
        toast({
          title: "Course Deleted",
          description: `The course "${courseToDelete.title}" has been successfully deleted.`,
        });
      } else {
         toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
      setCourseToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Thumbnail</span>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={course.title}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={course.thumbnail}
                    width="64"
                    data-ai-hint="course thumbnail"
                  />
                </TableCell>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                       <DropdownMenuItem asChild>
                        <Link href={`/admin/courses/edit/${course._id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleDeleteClick(course)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course titled &quot;{courseToDelete?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}