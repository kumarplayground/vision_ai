'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import dbConnect from './mongodb';
import Job from '@/models/Job';
import Course from '@/models/Course';

export async function getJobSummary(
  description: string
): Promise<{summary?: string; error?: string}> {
  // Temporarily disabled to debug deployment issues.
  return { error: 'AI summarization is temporarily unavailable.' };
  
  // if (!description) {
  //   return { error: 'Job description is empty.' };
  // }

  // try {
  //   const { summarizeJobDescription } = await import(
  //     '@/ai/flows/job-description-summarizer'
  //   );
  //   const result = await summarizeJobDescription({
  //     jobDescription: description,
  //   });
  //   return { summary: result.summary };
  // } catch (e) {
  //   console.error(e);
  //   return { error: 'Failed to generate summary. Please try again.' };
  // }
}

const JobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  company: z.string().min(2, 'Company must be at least 2 characters long.'),
  location: z.string().min(2, 'Location must be at least 2 characters long.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.'),
  applyLink: z.string().url('Please enter a valid URL.'),
  companyLogo: z.string().url("Please provide a valid URL for the company logo.").optional().or(z.literal('')),
});

type FormState = {
  message: string;
  errors?: {
    title?: string[];
    company?: string[];
    location?: string[];
    description?: string[];
    applyLink?: string[];
    companyLogo?: string[];
  } | null;
};

export async function createJob(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = JobSchema.safeParse({
    title: formData.get('title'),
    company: formData.get('company'),
    location: formData.get('location'),
    description: formData.get('description'),
    applyLink: formData.get('applyLink'),
    companyLogo: formData.get('companyLogo'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await dbConnect();
    await Job.create(validatedFields.data);

    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/admin/jobs');

    return { message: 'success' };
  } catch (error) {
    console.error('Failed to create job:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: null,
    };
  }
}

export async function updateJob(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get('id') as string;
  if (!id) {
    return { message: 'Job ID is missing.', errors: null };
  }

  const validatedFields = JobSchema.safeParse({
    title: formData.get('title'),
    company: formData.get('company'),
    location: formData.get('location'),
    description: formData.get('description'),
    applyLink: formData.get('applyLink'),
    companyLogo: formData.get('companyLogo'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await dbConnect();
    await Job.findByIdAndUpdate(id, validatedFields.data);

    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/admin/jobs');

    return { message: 'success' };
  } catch (error) {
    console.error('Failed to update job:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: null,
    };
  }
}

export async function deleteJob(
  jobId: string
): Promise<{ success: boolean; message: string }> {
  try {
    await dbConnect();
    await Job.findByIdAndDelete(jobId);

    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/admin/jobs');

    return { success: true, message: 'Job deleted successfully.' };
  } catch (error) {
    console.error('Failed to delete job:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

const CourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.'),
  thumbnail: z
    .string()
    .refine((val) => val.startsWith('http') || val.startsWith('data:image'), {
      message: 'Please enter a valid URL or upload an image.',
    }),
  buyLink: z.string().url('Please enter a valid URL.'),
});

type CourseFormState = {
  message: string;
  errors?: {
    title?: string[];
    description?: string[];
    thumbnail?: string[];
    buyLink?: string[];
  } | null;
};

export async function createCourse(
  prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const validatedFields = CourseSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    thumbnail: formData.get('thumbnail'),
    buyLink: formData.get('buyLink'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await dbConnect();
    await Course.create(validatedFields.data);

    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath('/admin/courses');

    return { message: 'success' };
  } catch (error) {
    console.error('Failed to create course:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: null,
    };
  }
}

export async function updateCourse(
  prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const id = formData.get('id') as string;
  if (!id) {
    return { message: 'Course ID is missing.', errors: null };
  }

  const validatedFields = CourseSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    thumbnail: formData.get('thumbnail'),
    buyLink: formData.get('buyLink'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await dbConnect();
    await Course.findByIdAndUpdate(id, validatedFields.data);

    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath('/admin/courses');

    return { message: 'success' };
  } catch (error) {
    console.error('Failed to update course:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: null,
    };
  }
}

export async function deleteCourse(
  courseId: string
): Promise<{ success: boolean; message: string }> {
  try {
    await dbConnect();
    await Course.findByIdAndDelete(courseId);

    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath('/admin/courses');

    return { success: true, message: 'Course deleted successfully.' };
  } catch (error) {
    console.error('Failed to delete course:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}