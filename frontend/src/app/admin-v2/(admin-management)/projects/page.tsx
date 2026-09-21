import { ProjectPage } from "@/components/admin/features/project/project-page";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Projects" };
export default function () {
  return <ProjectPage />;
}
