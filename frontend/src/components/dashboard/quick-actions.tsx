import Link from "next/link";
import {
  FolderOpen,
  Code2,
  Briefcase,
  GraduationCap,
  Images,
  Award,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface ActionItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const actions: ActionItem[] = [
  { icon: FolderOpen, label: "Add Project", href: "/admin-v2/posts" },
  { icon: Code2, label: "Add Skill", href: "/admin-v2/skills" },
  { icon: Briefcase, label: "Add Experience", href: "/admin-v2/experiences" },
  { icon: GraduationCap, label: "Add Education", href: "/admin-v2/educations" },
  { icon: Images, label: "Add Gallery", href: "/admin-v2/gallery" },
  { icon: Award, label: "Add Certificate", href: "/admin-v2/certificates" },
  { icon: Wrench, label: "Add Service", href: "/admin-v2/services" },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <action.icon className="size-4 shrink-0" />
              <span className="truncate">{action.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
