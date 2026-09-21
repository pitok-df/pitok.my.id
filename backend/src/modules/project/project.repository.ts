import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";

export class ProjectRepository {
  async findAll() {
    return prisma.project.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        demoUrl: true,
        featured: true,
        skills: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(projectId: string) {
    return prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        demoUrl: true,
        featured: true,
        skills: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        demoUrl: data.demoUrl,
        featured: data.featured,
        skills: data.skills,
      },
    });
  }

  async delete(projectId: string) {
    return prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  }

  async update(projectId: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        demoUrl: data.demoUrl,
        featured: data.featured,
        skills: data.skills,
      },
    });
  }
}
