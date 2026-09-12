import { Context, handleUploads, LocalDiskStorage } from "@buntok/core";

export class UploaderService {
  private storage = new LocalDiskStorage("./resources");

  async upload(ctx: Context) {
    const result = await handleUploads(ctx, {
      storage: this.storage,
      fields: {
        thumbnail: {
          allowedMimeTypes: ["image/jpeg", "image/png"],
          outputFormat: "webp",
          filename(originalName, file) {
            const cleanName = originalName
              .replace(/\.[^/.]+$/, "")
              .replace(/\s+/g, "-")
              .toLowerCase();
            return {
              name: `thumbnail/${cleanName}-${Date.now()}`,
              ext: "webp",
            };
          },
        },
        galery: {
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
          outputFormat: "webp",
          multiple: true,
          filename(originalName, file) {
            const cleanName = originalName
              .replace(/\.[^/.]+$/, "")
              .replace(/\s+/g, "-")
              .toLowerCase();
            return {
              name: `galeries/${cleanName}-${Date.now()}`,
              ext: "webp",
            };
          },
        },
      },
    });

    return {
      thumbnail_url: result.fields.thumbnail?.path
        ? `http://localhost:1212/${result.fields.thumbnail?.path}`
        : undefined,
      galery_url:
        result.fields.galery && result.fields.galery.length > 0
          ? result.fields.galery.map(
              (glry) => `http://localhost:1212/${glry.path}`,
            )
          : undefined,
    };
  }
}
