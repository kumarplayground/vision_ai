import { ReactNode } from "react";
import {
  Briefcase,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

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

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
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
                <SidebarTrigger />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>{children}</SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
