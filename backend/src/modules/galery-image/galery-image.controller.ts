import {
  Dependencies,
  Controller,
  Get,
  Context,
  Post,
  type ZodCtx,
  HttpCode,
  Use,
  requireAuth,
  Delete,
} from "@buntok/core";
import { GaleryImageService } from "./galery-image.service";
import {
  CreateGaleryImageSchema,
  DeleteGalleryImageManySchema,
  DeleteGalleryImageSchema,
  type CreateGaleryImageInput,
  type DeleteGalleryImageManyInput,
  type DeleteGalleryImageParam,
} from "./galery-image.schema";
import { zValidator } from "@buntok/core/middlewares/validator";
import { env } from "@/env";

@Dependencies(GaleryImageService)
@Controller("/galery-images")
export class GaleryImageController {
  constructor(private readonly galeryimageService: GaleryImageService) {}

  @Get("/")
  async getAll(ctx: Context) {
    const galleries = await this.galeryimageService.getAll();

    return ctx.success(galleries);
  }

  @Post("/")
  @HttpCode(201)
  @Use(requireAuth(env.JWT_SECRET!))
  @Use(
    zValidator("body", CreateGaleryImageSchema, {
      contentType: "multipart/form-data",
    }),
  )
  async save(ctx: ZodCtx<{ body: CreateGaleryImageInput }>) {
    const data = ctx.valid("body");
    const gallery = await this.galeryimageService.saveGallery(data);

    return ctx.success(gallery);
  }

  @Delete("/:galleryId")
  @Use(requireAuth(env.JWT_SECRET!))
  @Use(zValidator("params", DeleteGalleryImageSchema))
  async delete(ctx: ZodCtx<{ params: DeleteGalleryImageParam }>) {
    const data = ctx.valid("params");
    const gallery = await this.galeryimageService.deleteGallery(data.galleryId);

    return ctx.success(gallery, "Gallery has successfully delete.");
  }

  @Post("/delete-many")
  @Use(zValidator("body", DeleteGalleryImageManySchema))
  @Use(requireAuth(env.JWT_SECRET!))
  async deleteMany(ctx: ZodCtx<{ body: DeleteGalleryImageManyInput }>) {
    const data = ctx.valid("body");
    const deleted = await this.galeryimageService.deleteGalleryMany(data);

    return ctx.success(
      null,
      deleted.length > 0
        ? `Gallery (${deleted.map((d) => d.caption).join(", ")}) berhasil dihapus`
        : "Tidak ada yang dihapus",
    );
  }
}
