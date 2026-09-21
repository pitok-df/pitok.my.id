import SkillPage from "@/components/admin/features/skills/skill-page";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Skills" };
export default function () {
  return <SkillPage />;
}
