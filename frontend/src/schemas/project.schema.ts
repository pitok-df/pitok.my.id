import z from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  demoUrl: z.string().url("Demo URL must be a valid URL").optional(),
  featured: z.boolean().optional(),
  technologies: z.array(z.string()).optional(),
});

export type ProjectTypeValues = z.infer<typeof projectSchema>;
