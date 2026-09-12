import {
  FolderOpen,
  Briefcase,
  GraduationCap,
  Images,
  MessagesSquare,
  Mail,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProfileSummary } from "@/components/dashboard/profile-summary";
import { QuickActions } from "@/components/dashboard/quick-actions";

const stats = [
  { icon: FolderOpen, label: "Projects", value: 12, href: "/admin-v2/projects" },
  {
    icon: Briefcase,
    label: "Experiences",
    value: 5,
    href: "/admin-v2/experience",
  },
  {
    icon: GraduationCap,
    label: "Educations",
    value: 3,
    href: "/admin-v2/education",
  },
  { icon: Images, label: "Gallery", value: 48, href: "/admin-v2/gallery" },
  {
    icon: MessagesSquare,
    label: "Topics",
    value: 15,
    href: "/admin-v2/topics",
  },
  {
    icon: Mail,
    label: "Messages",
    value: 8,
    description: "3 unread",
    href: "/admin-v2/messages",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ProfileSummary />

      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Overview
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.href} {...stat} />
          ))}
        </div>
      </div>

      <QuickActions />
    </div>
  );
}
