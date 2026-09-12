import { Context, Controller, Post, Use } from "@buntok/core";
import { zValidator } from "@buntok/core/middlewares/validator";
import type { UploaderService } from "./uploader.service";
import { UploadSchema } from "./uploader.schema";

@Controller("/upload")
export class UploaderController {
  constructor(private uploadService: UploaderService) {}

  @Post("/")
  @Use(zValidator("body", UploadSchema, { contentType: "multipart/form-data" }))
  async upload(ctx: Context) {
    const result = await this.uploadService.upload(ctx);

    return ctx.success(result);
  }
}
