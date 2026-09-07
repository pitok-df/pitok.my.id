"use client";

import {
  Award,
  Briefcase,
  GraduationCap,
  Home,
  Image as ImageIcon,
  Layers,
  Loader2,
  LogOut,
  Mail,
  MessageSquare,
  Rocket,
  Search,
  Shield,
  User,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { AboutEditor } from "@/components/admin/AboutEditor";
import { CertificatesEditor } from "@/components/admin/CertificatesEditor";
import { ContactEditor } from "@/components/admin/ContactEditor";
import { EducationEditor } from "@/components/admin/EducationEditor";
import { ExperienceEditor } from "@/components/admin/ExperienceEditor";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { ProjectsEditor } from "@/components/admin/ProjectsEditor";
import { ServicesEditor } from "@/components/admin/ServicesEditor";
import { SiteMetaEditor } from "@/components/admin/SiteMetaEditor";
import { SkillsEditor } from "@/components/admin/SkillsEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLogin, useLogout, useMe } from "@/hooks/queries/useAuth";
import { cn } from "@/lib/utils";

type LucideIcon = React.ComponentType<{ className?: string }>;

interface NavItem {
  id: string;
  label: string;
  Icon: LucideIcon;
  group: "content" | "media" | "settings";
}

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Hero", Icon: Home, group: "content" },
  { id: "about", label: "About", Icon: User, group: "content" },
  { id: "skills", label: "Skills", Icon: Zap, group: "content" },
  { id: "services", label: "Services", Icon: Wrench, group: "content" },
  { id: "projects", label: "Projects", Icon: Rocket, group: "content" },
  { id: "experience", label: "Experience", Icon: Briefcase, group: "content" },
  {
    id: "education",
    label: "Education",
    Icon: GraduationCap,
    group: "content",
  },
  { id: "certifications", label: "Credentials", Icon: Award, group: "content" },
  { id: "gallery", label: "Gallery", Icon: ImageIcon, group: "media" },
  { id: "guestbook", label: "Guestbook", Icon: MessageSquare, group: "media" },
  { id: "contact", label: "Contact", Icon: Mail, group: "settings" },
  { id: "seo", label: "SEO", Icon: Search, group: "settings" },
];

const GROUP_LABELS: Record<string, string> = {
  content: "Content",
  media: "Media",
  settings: "Settings",
};

function LoginScreen() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center font-mono font-bold text-white text-lg mx-auto mb-4">
            PD
          </div>
          <h1 className="text-xl font-bold text-zinc-100">Admin Panel</h1>
          <p className="text-sm text-zinc-500 mt-1">pitok.my.id</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-400">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pitok.my.id"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-zinc-400">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                  required
                />
              </div>

              {login.isError && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {login.error instanceof Error
                    ? login.error.message
                    : "Login failed"}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                disabled={login.isPending}
              >
                {login.isPending ? "Authenticating..." : "Login to Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-4 text-xs text-zinc-600">
          <a href="/" className="text-red-500 hover:underline">
            ← Back to Portfolio
          </a>
        </p>
      </div>
    </div>
  );
}

function GuestbookPlaceholder() {
  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-sm text-zinc-100">Guestbook Log</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500">
            Guestbook management is coming soon. Messages are currently managed
            through the legacy API.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-zinc-100">System Monitor</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span className="text-sm text-zinc-300">
                All systems operational
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">
              Backend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm text-zinc-300 font-mono">
              {process.env.NEXT_PUBLIC_BACKEND_URL || "Not configured"}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">
              Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm text-zinc-300">
              {NAV_ITEMS.length} sections configured
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SectionContent({ section }: { section: string }) {
  switch (section) {
    case "hero":
      return <HeroEditor />;
    case "about":
      return <AboutEditor />;
    case "skills":
      return <SkillsEditor />;
    case "projects":
      return <ProjectsEditor />;
    case "experience":
      return <ExperienceEditor />;
    case "education":
      return <EducationEditor />;
    case "certifications":
      return <CertificatesEditor />;
    case "services":
      return <ServicesEditor />;
    case "gallery":
      return <GalleryEditor />;
    case "guestbook":
      return <GuestbookPlaceholder />;
    case "contact":
      return <ContactEditor />;
    case "seo":
      return <SiteMetaEditor />;
    default:
      return <DashboardOverview />;
  }
}

export default function AdminPage() {
  const { data: me, isLoading: meLoading } = useMe();
  const logout = useLogout();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthed = Boolean(me);

  if (meLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-zinc-950">
        <Loader2 className="size-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!isAuthed) {
    return <LoginScreen />;
  }

  const groups = NAV_ITEMS.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>,
  );

  return (
    <div className="min-h-dvh flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-red-500 rounded-lg flex items-center justify-center font-mono font-bold text-white text-xs">
              PD
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-100">Admin</h1>
              <p className="text-[10px] text-zinc-600">pitok.my.id</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Dashboard */}
          <button
            type="button"
            onClick={() => {
              setActiveSection("dashboard");
              setSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              activeSection === "dashboard"
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
            )}
          >
            <Shield className="size-4" />
            Dashboard
          </button>

          <Separator className="bg-zinc-800 my-2" />

          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <p className="px-3 py-1 text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                {GROUP_LABELS[group]}
              </p>
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    activeSection === item.id
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                  )}
                >
                  <item.Icon className="size-4" />
                  {item.label}
                </button>
              ))}
              {group !== "settings" && (
                <Separator className="bg-zinc-800 my-2" />
              )}
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-zinc-800">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut className="size-4" />
            {logout.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-muted"
          >
            <Layers className="size-5" />
          </button>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          <SectionContent section={activeSection} />
        </div>
      </main>
    </div>
  );
}
