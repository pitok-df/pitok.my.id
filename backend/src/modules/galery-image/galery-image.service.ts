import { Dependencies, LocalDiskStorage, uuid } from "@buntok/core";
import { GaleryImageRepository } from "./galery-image.repository";
import type {
  CreateGaleryImageInput,
  DeleteGalleryImageManyInput,
} from "./galery-image.schema";
import { env } from "@/env";

@Dependencies(GaleryImageRepository)
export class GaleryImageService {
  private storage = new LocalDiskStorage("./resources");
  constructor(private readonly galeryImageRepository: GaleryImageRepository) {}

  async getAll() {
    const galleries = await this.galeryImageRepository.findAll();
    return galleries.map((gallery) => ({
      ...gallery,
      imageUrl: `http://localhost:${env.PORT}/${gallery.imageUrl}`,
    }));
  }

  async saveGallery(data: CreateGaleryImageInput) {
    const fileName = "/galleries/" + uuid();

    const uploadResult = await this.storage.handleFile(
      data.image,
      fileName,
      ".webp",
    );

    const gallery = await this.galeryImageRepository.create({
      imageUrl: uploadResult.path!,
      caption: data.caption,
    });

    return gallery;
  }

  async deleteGallery(galleryId: string) {
    const deletedGallery =
      await this.galeryImageRepository.deleteGallery(galleryId);

    await this.storage.deleteFile(deletedGallery.imageUrl);
    return deletedGallery;
  }

  async deleteGalleryMany(data: DeleteGalleryImageManyInput) {
    const selectedGalleries = await this.galeryImageRepository.getByOnId(
      data.galleryId,
    );

    if (selectedGalleries) {
      await this.galeryImageRepository.deleteMany(data.galleryId);
    }

    for (const selectedGallery of selectedGalleries) {
      this.storage.deleteFile(selectedGallery.imageUrl);
    }

    return selectedGalleries;
  }
}
