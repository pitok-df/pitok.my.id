import { v2 as cloudinary } from "cloudinary";
import {
  LocalDiskStorage,
  type StorageDriver,
  type UploadedFile,
} from "@buntok/core";
import { env } from "@/env";

export interface CloudinaryStorageOptions {
  folder?: string;
  resourceType?: "auto" | "image" | "video" | "raw";
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}

let isConfigured = false;

function ensureConfigured(opts?: CloudinaryStorageOptions) {
  if (isConfigured) return;
  const cloudName = opts?.cloudName ?? env.CLOUDINARY_CLOUD_NAME;
  const apiKey = opts?.apiKey ?? env.CLOUDINARY_API_KEY;
  const apiSecret = opts?.apiSecret ?? env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  isConfigured = true;
}

function extractPublicId(path: string): string {
  if (!path.includes("cloudinary.com") && !path.includes("/upload/")) {
    return path.replace(/\.[^/.]+$/, "");
  }

  try {
    const uploadIdx = path.indexOf("/upload/");
    let after =
      uploadIdx !== -1 ? path.slice(uploadIdx + "/upload/".length) : path;
    after = after.split("?")[0]!;

    const parts = after.split("/").filter(Boolean);
    if (parts[0]?.match(/^v\d+$/)) {
      parts.shift();
    }

    const versionIdx = parts.findIndex((p) => /^v\d+$/.test(p));
    const publicParts = versionIdx !== -1 ? parts.slice(versionIdx + 1) : parts;

    const withExt = publicParts.join("/");
    return withExt.replace(/\.[^/.]+$/, "");
  } catch {
    return path.replace(/\.[^/.]+$/, "");
  }
}

export class CloudinaryStorage implements StorageDriver {
  private folder: string;
  private resourceType: "auto" | "image" | "video" | "raw";

  constructor(options: CloudinaryStorageOptions = {}) {
    this.folder = options.folder ?? env.CLOUDINARY_FOLDER ?? "uploads";
    this.resourceType = options.resourceType ?? "auto";
    ensureConfigured(options);
    if (options.cloudName && options.apiKey && options.apiSecret) {
      cloudinary.config({
        cloud_name: options.cloudName,
        api_key: options.apiKey,
        api_secret: options.apiSecret,
        secure: true,
      });
      isConfigured = true;
    }
  }

  async handleFile(
    file: File,
    name: string,
    ext: string,
  ): Promise<UploadedFile> {
    ensureConfigured();

    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      throw new Error(
        "Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const publicId = this.folder ? `${this.folder}/${name}` : name;

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            resource_type: this.resourceType,
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              const message =
                (error as { message?: string })?.message ??
                (typeof error === "string" ? error : JSON.stringify(error));
              return reject(new Error(`Cloudinary upload failed: ${message}`));
            }
            if (!result)
              return reject(
                new Error("Cloudinary upload failed: empty result"),
              );
            resolve(result as { secure_url: string; public_id: string });
          },
        );
        stream.end(buffer);
      },
    );

    return {
      originalName: file.name,
      name,
      ext,
      size: file.size,
      type: file.type || "application/octet-stream",
      path: result.secure_url,
    };
  }

  async deleteFile(path: string): Promise<boolean> {
    ensureConfigured();

    if (!path) return false;

    const publicId = extractPublicId(path);

    const resourceTypes: Array<"image" | "video" | "raw"> =
      this.resourceType === "auto"
        ? ["image", "video", "raw"]
        : [this.resourceType as "image" | "video" | "raw"];

    for (const rt of resourceTypes) {
      try {
        const res = await cloudinary.uploader.destroy(publicId, {
          resource_type: rt,
          invalidate: true,
        });
        if ((res as { result: string }).result === "ok") return true;
        if (
          (res as { result: string }).result === "not found" &&
          rt === resourceTypes[resourceTypes.length - 1]
        ) {
          return false;
        }
        if ((res as { result: string }).result === "not found") continue;
      } catch {
        continue;
      }
    }
    return false;
  }
}

export const storeStorage = new LocalDiskStorage("./resources");
//new CloudinaryStorage();
