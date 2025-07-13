'use server';

import {revalidatePath} from 'next/cache';
import {z} from 'zod';
import {jobs, courses} from './data';
import type {Job, Course} from '@/types';
import fs from 'fs/promises';
import path from 'path';

export async function getJobSummary(
  description: string
): Promise<{summary?: string; error?: string}> {
  if (!description) {
    return {error: 'Job description is empty.'};
  }

  try {
    const {summarizeJobDescription} = await import(
      '@/ai/flows/job-description-summarizer'
    );
    const result = await summarizeJobDescription({
      jobDescription: description,
    });
    return {summary: result.summary};
  } catch (e) {
    console.error(e);
    return {error: 'Failed to generate summary. Please try again.'};
  }
}

const JobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  company: z.string().min(2, 'Company must be at least 2 characters long.'),
  location: z.string().min(2, 'Location must be at least 2 characters long.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.'),
});

type FormState = {
  message: string;
  errors?: {
    title?: string[];
    company?: string[];
    location?: string[];
    description?: string[];
  } | null;
};

async function saveJobs(newJobs: Job[]) {
  const dataPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
  const fileContent = await fs.readFile(dataPath, 'utf8');

  const newJobsString = JSON.stringify(newJobs, null, 2);
  
  const updatedFileContent = fileContent.replace(
    /(export const jobs: Job\[] = )\[[\s\S]*?];/,
    `$1${newJobsString};`
  );

  await fs.writeFile(dataPath, updatedFileContent, 'utf8');
}

export async function createJob(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = JobSchema.safeParse({
    title: formData.get('title'),
    company: formData.get('company'),
    location: formData.get('location'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const newJob: Job = {
      id: String(Date.now()),
      ...validatedFields.data,
      postedAt: 'Just now',
      applyLink: '#',
    };

    const newJobs = [newJob, ...jobs];
    await saveJobs(newJobs);

    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/admin/jobs');

    return {message: 'success'};
  } catch (error) {
    console.error('Failed to create job:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: null,
    };
  }
}

const CourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.'),
  thumbnail: z.string().refine(val => val.startsWith('http') || val.startsWith('data:image'), {
    message: 'Please enter a valid URL or upload an image.'
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

async function saveCourses(newCourses: Course[]) {
  const dataPath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
  const fileContent = await fs.readFile(dataPath, 'utf8');

  const newCoursesString = JSON.stringify(newCourses, null, 2);

  const updatedFileContent = fileContent.replace(
    /(export const courses: Course\[] = )\[[\s\S]*?];/,
    `$1${newCoursesString};`
  );

  await fs.writeFile(dataPath, updatedFileContent, 'utf8');
}


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
    const newCourse: Course = {
      id: String(Date.now()),
      ...validatedFields.data,
    };

    const newCourses = [newCourse, ...courses];
    await saveCourses(newCourses);

    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath('/admin/courses');

    return {message: 'success'};
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
    const updatedCourses = courses.map((course) =>
      course.id === id ? { ...course, ...validatedFields.data } : course
    );

    await saveCourses(updatedCourses);

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
    const updatedCourses = courses.filter((course) => course.id !== courseId);
    await saveCourses(updatedCourses);

    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath('/admin/courses');

    return { success: true, message: 'Course deleted successfully.' };
  } catch (error) {
    console.error('Failed to delete course:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
