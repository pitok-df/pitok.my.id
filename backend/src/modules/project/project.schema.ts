import { z } from "@buntok/core/middlewares/validator";

export const CreateProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(5),
  thumbnail: z
    .file()
    .mime(["image/jpeg", "image/png", "image/webp"])
    .optional(),
  demoUrl: z
    .union([z.url(), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  featured: z.coerce.boolean().default(true),
  skills: z
    .preprocess((val) => {
      if (val === undefined || val === null || val === "") return undefined;
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
        if (val.includes(","))
          return val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        return [val];
      }
      return val;
    }, z.array(z.string()).optional())
    .optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
