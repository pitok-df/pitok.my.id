import { z } from "@buntok/core";

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
});

export const skillUpdateSchema = skillSchema.partial();

export type SkillSchema = z.infer<typeof skillSchema>;
export type SkillUpdateSchema = z.infer<typeof skillUpdateSchema>;
