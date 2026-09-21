import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Cable,
  Cloud,
  CloudCog,
  Code2,
  Database,
  GitBranch,
  Layers3,
  Monitor,
  Server,
  ShieldCheck,
  TestTube2,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SkillCategory {
  name: string;
  icon: LucideIcon;
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    icon: Code2,
  },
  {
    name: "Frontend Development",
    icon: Monitor,
  },
  {
    name: "Backend Development",
    icon: Server,
  },
  {
    name: "Database",
    icon: Database,
  },
  {
    name: "ORM & Data Access",
    icon: Layers3,
  },
  {
    name: "DevOps & Deployment",
    icon: CloudCog,
  },
  {
    name: "Cloud & Infrastructure",
    icon: Cloud,
  },
  {
    name: "Testing",
    icon: TestTube2,
  },
  {
    name: "Version Control",
    icon: GitBranch,
  },
  {
    name: "API & Communication",
    icon: Cable,
  },
  {
    name: "Authentication & Security",
    icon: ShieldCheck,
  },
  {
    name: "Tools & Workflow",
    icon: Wrench,
  },
];

export const mapCategoryIcon: Record<SkillCategory["name"], LucideIcon> = {
  "Programming Languages": Code2,
  "Frontend Development": Monitor,
  "Backend Development": Server,
  Database: Database,
  "ORM & Data Access": Layers3,
  "DevOps & Deployment": CloudCog,
  "Cloud & Infrastructure": Cloud,
  Testing: TestTube2,
  "Version Control": GitBranch,
  "API & Communication": Cable,
  "Authentication & Security": ShieldCheck,
  "Tools & Workflow": Wrench,
};
