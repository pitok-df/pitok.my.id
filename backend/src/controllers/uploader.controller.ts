import { uploaderSchema } from "@/schemas/upload.schema";
import type { UploaderService } from "@/services/uploader.service";
import {
  Context,
  Controller,
  handleUploads,
  LocalDiskStorage,
  Post,
  slugify,
  Use,
  zValidator,
} from "@buntok/core";

@Controller("/upload")
export class UploaderController {
  constructor(private uploadService: UploaderService) {}

  @Post("/")
  @Use(
    zValidator("body", uploaderSchema, { contentType: "multipart/form-data" }),
  )
  async upload(ctx: Context) {
    const result = await this.uploadService.upload(ctx);

    return ctx.success(result);
  }
}
