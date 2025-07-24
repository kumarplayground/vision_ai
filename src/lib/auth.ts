'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE_NAME = 'admin_auth';
const ADMIN_USERID = process.env.ADMIN_USERID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function login(
  prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const userId = formData.get('userId') as string;
  const password = formData.get('password') as string;

  if (!ADMIN_USERID || !ADMIN_PASSWORD) {
    return { error: 'Admin credentials are not configured on the server.' };
  }

  if (userId !== ADMIN_USERID || password !== ADMIN_PASSWORD) {
    return { error: 'Invalid User ID or password.' };
  }

  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE_NAME, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  redirect('/admin');
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect('/admin/login');
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = cookies();
  return cookieStore.has(AUTH_COOKIE_NAME);
}
