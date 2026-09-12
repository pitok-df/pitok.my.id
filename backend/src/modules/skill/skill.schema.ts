import { z } from "@buntok/core/middlewares/validator";

export const CreateSkillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
});

export const UpdateSkillSchema = CreateSkillSchema.partial();

export type CreateSkillInput = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillInput = z.infer<typeof UpdateSkillSchema>;
