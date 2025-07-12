"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Lock } from "lucide-react";
import { login } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const [state, formAction] = useFormState(login, undefined);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>
          Enter your password to access the admin panel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>
          {state?.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          <LoginButton />
        </form>
      </CardContent>
    </Card>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Logging in..." : "Login"}
      <Lock className="ml-2 h-4 w-4" />
    </Button>
  );
}
