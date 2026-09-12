import { z } from "@buntok/core/middlewares/validator";

export const UploadSchema = z.object({
  thumbnail: z.file().optional(),
  galery: z.file().optional(),
});
