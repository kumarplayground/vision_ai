import { ReactNode } from "react";
import {
  Briefcase,
  BookOpen,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { redirect } from 'next/navigation';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { checkAuth, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-dvh flex-col bg-background">
        <Header />
        <div className="flex flex-1">
          <Sidebar>
            <SidebarHeader>
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      href={item.href}
                      asChild
                      tooltip={{ children: item.label }}
                    >
                      <a href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="flex-col items-start gap-2 p-2">
               <form action={logout} className="w-full">
                  <Button variant="ghost" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </form>
                <SidebarTrigger />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>{children}</SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
