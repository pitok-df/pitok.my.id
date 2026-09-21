import { skillCategories } from "@/lib/utils";
import z from "zod";

const skillCategoryEnum = z.enum(skillCategories.map((c) => c.name));
export const createSkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: skillCategoryEnum,
});

export const updateSkillSchema = createSkillSchema.partial();

export type CreateSkillTypeValues = z.infer<typeof createSkillSchema>;
export type UpdateSkillTypeValues = z.infer<typeof updateSkillSchema>;
