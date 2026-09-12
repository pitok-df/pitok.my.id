import { Context, Controller, Dependencies, Post, Use } from "@buntok/core";
import { zValidator } from "@buntok/core/middlewares/validator";
import { UploaderService } from "./uploader.service";
import { UploadSchema } from "./uploader.schema";

@Dependencies(UploaderService)
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
