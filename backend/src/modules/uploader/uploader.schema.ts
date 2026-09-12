import { z } from "@buntok/core/middlewares/validator";

export const UploadSchema = z
  .object({
    thumbnail: z.file().optional(),
    galery: z.array(z.file()).optional(),
  })
  .refine(
    (data) =>
      (data.thumbnail && !data.galery) || (!data.thumbnail && data.galery),
    {
      message: "Kirim salah satu: thumbnail atau galery",
    },
  );
