import { z } from "@buntok/core/middlewares/validator";

export const CreateGaleryImageSchema = z.object({
  image: z.file().mime(["image/png", "image/webp", "image/jpeg"]),
  caption: z.string().min(5),
});

export const DeleteGalleryImageSchema = z.object({
  galleryId: z.cuid2(),
});

export const DeleteGalleryImageManySchema = z.object({
  galleryId: z.array(z.cuid2()),
});

export type CreateGaleryImageInput = z.infer<typeof CreateGaleryImageSchema>;
export type DeleteGalleryImageParam = z.infer<typeof DeleteGalleryImageSchema>;
export type DeleteGalleryImageManyInput = z.infer<
  typeof DeleteGalleryImageManySchema
>;
