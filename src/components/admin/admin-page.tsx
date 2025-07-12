import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AdminPageProps {
  title: string;
  description: string;
  buttonText: string;
  children: ReactNode;
}

export function AdminPage({
  title,
  description,
  buttonText,
  children,
}: AdminPageProps) {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
