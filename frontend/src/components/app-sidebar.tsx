"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  LayoutDashboard,
  FolderOpen,
  Code2,
  Briefcase,
  GraduationCap,
  Images,
  MessagesSquare,
  MessageSquare,
  Settings,
  ChevronsUpDown,
} from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: { label: string; items: MenuItem[] }[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/admin-v2", icon: LayoutDashboard }],
  },
  {
    label: "Portfolio",
    items: [
      { title: "Projects", url: "/admin-v2/projects", icon: FolderOpen },
      { title: "Skills", url: "/admin-v2/skills", icon: Code2 },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Experience", url: "/admin-v2/experience", icon: Briefcase },
      { title: "Education", url: "/admin-v2/education", icon: GraduationCap },
      { title: "Gallery", url: "/admin-v2/gallery", icon: Images },
    ],
  },
  {
    label: "Community",
    items: [
      { title: "Topics", url: "/admin-v2/topics", icon: MessagesSquare },
      { title: "Messages", url: "/admin-v2/messages", icon: MessageSquare },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", url: "/admin-v2/settings", icon: Settings }],
  },
];

const workspaces = ["Personal", "Acme Inc", "Team Project"];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                    P
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Personal</span>
                    <span className="truncate text-muted-foreground">
                      Workspace
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-popper-anchor-width]"
                side="bottom"
                align="start"
              >
                {workspaces.map((ws) => (
                  <DropdownMenuItem key={ws}>
                    <span>{ws}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="text-muted-foreground">
                    Manage workspaces
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        item.url === "/admin-v2"
                          ? pathname === "/admin-v2"
                          : pathname.startsWith(item.url)
                      }
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

    </Sidebar>
  );
}
