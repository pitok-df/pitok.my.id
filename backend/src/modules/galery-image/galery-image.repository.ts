import { prisma } from "@/libs/prisma";
import type { Prisma } from "@/generated/prisma/client";

export class GaleryImageRepository {
  async findAll() {
    return prisma.galleryImage.findMany();
  }

  async create(data: Prisma.GalleryImageCreateInput) {
    return prisma.galleryImage.create({
      data: { imageUrl: data.imageUrl, caption: data.caption },
    });
  }

  async deleteGallery(galleryId: string) {
    return prisma.galleryImage.delete({ where: { id: galleryId } });
  }

  async deleteMany(galleryIds: string[]) {
    return prisma.galleryImage.deleteMany({
      where: { id: { in: galleryIds } },
    });
  }

  async getByOnId(galleryIds: string[]) {
    return prisma.galleryImage.findMany({
      where: { id: { in: galleryIds } },
    });
  }
}
