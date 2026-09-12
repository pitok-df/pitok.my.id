import { z } from "@buntok/core";

export const uploaderSchema = z.object({
  thumbnail: z.file().optional(),
  galery: z.file().optional(),
});
