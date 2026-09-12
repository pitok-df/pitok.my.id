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
      },
    });

    return {
      thumbnail_url: `http://localhost:1212/${result.fields.thumbnail?.path}`,
    };
  }
}
