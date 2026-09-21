import z from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.file(),
  demoUrl: z.url("Demo URL must be a valid URL").optional(),
  featured: z.boolean().optional(),
  skills: z.array(z.string()).optional(),
});

export const updateProjectSchema = projectSchema.partial();

export type ProjectTypeValues = z.infer<typeof projectSchema>;
export type UpdateProjectTypeValues = z.infer<typeof updateProjectSchema>;
