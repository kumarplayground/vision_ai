import { ReactNode } from "react";
import {
  Briefcase,
  BookOpen,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";

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
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-dvh flex-col bg-background">
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
                      asChild
                      tooltip={{ children: item.label }}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="flex-col !gap-4 !p-4">
               <form action={logout}>
                  <Button variant="outline" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
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
