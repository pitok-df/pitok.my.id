import { Dependencies, NotFoundError } from "@buntok/core";
import { ProjectRepository } from "./project.repository";
import type { CreateProjectInput, UpdateProjectInput } from "./project.schema";
import { SkillRepository } from "../skill";
import { uuid } from "@buntok/core/middlewares";
import { storeStorage } from "@/libs/storage";
import { env } from "@/env";

@Dependencies(ProjectRepository, SkillRepository)
export class ProjectService {
  private storage = storeStorage;

  private formatThumbnail(url?: string | null) {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `http://localhost:${env.PORT}/${url}`;
  }

  constructor(
    private readonly projectRepository: ProjectRepository,
    private skillRepository: SkillRepository,
  ) {}

  async getAll() {
    const projects = await this.projectRepository.findAll();
    return projects.map((project) => ({
      ...project,
      ...(project.thumbnail && {
        thumbnail: this.formatThumbnail(project.thumbnail),
      }),
    }));
  }

  async save(data: CreateProjectInput) {
    const skills = await this.validateSkills(data.skills);

    let thumbnailPath: string | undefined;

    try {
      thumbnailPath = await this.uploadThumbnail(data.thumbnail);

      const project = await this.projectRepository.create({
        title: data.title,
        description: data.description,
        demoUrl: data.demoUrl,
        featured: true,
        skills: {
          connect: skills.map(({ id }) => ({ id })),
        },
        ...(thumbnailPath && {
          thumbnail: thumbnailPath,
        }),
      });

      return {
        ...project,
        ...(project.thumbnail && {
          thumbnail: this.formatThumbnail(project.thumbnail),
        }),
      };
    } catch (error) {
      if (thumbnailPath) {
        await this.cleanupThumbnail(thumbnailPath);
      }

      throw error;
    }
  }

  async delete(projectId: string) {
    const deletedProject = await this.projectRepository.delete(projectId);

    if (deletedProject.thumbnail) {
      await this.cleanupThumbnail(deletedProject.thumbnail);
    }

    return deletedProject;
  }

  async update(projectId: string, data: UpdateProjectInput) {
    const skills = await this.validateSkills(data.skills);

    let thumbnailPath: string | undefined;

    try {
      if (data.thumbnail) {
        thumbnailPath = await this.uploadThumbnail(data.thumbnail);
      }

      const existingProject = await this.projectRepository.findById(projectId);
      if (!existingProject) {
        throw new NotFoundError("Project not found");
      }

      const project = await this.projectRepository.update(projectId, {
        title: data.title,
        description: data.description,
        demoUrl: data.demoUrl,
        featured: true,
        skills: {
          set: skills.map(({ id }) => ({ id })),
        },
        ...(thumbnailPath && {
          thumbnail: thumbnailPath,
        }),
      });

      if (thumbnailPath && existingProject.thumbnail) {
        await this.cleanupThumbnail(existingProject.thumbnail);
      }

      return {
        ...project,
        ...(project.thumbnail && {
          thumbnail: this.formatThumbnail(project.thumbnail),
        }),
      };
    } catch (error) {
      if (thumbnailPath) {
        await this.cleanupThumbnail(thumbnailPath);
      }

      throw error;
    }
  }

  private async validateSkills(
    skillNames?: string[],
  ): Promise<{ id: string; name: string }[]> {
    if (!skillNames?.length) {
      return [];
    }

    const skills = await this.skillRepository.getSkillInName(skillNames);

    if (skills.length === skillNames.length) {
      return skills;
    }

    const found = new Set(skills.map(({ name }) => name));
    const missing = skillNames.filter((name) => !found.has(name));

    throw new NotFoundError(`Skills not found: ${missing.join(", ")}`);
  }

  private async uploadThumbnail(
    file?: CreateProjectInput["thumbnail"],
  ): Promise<string | undefined> {
    if (!file) {
      return undefined;
    }

    const ext = file.name.includes(".")
      ? `.${file.name.split(".").pop()}`
      : ".webp";

    const result = await this.storage.handleFile(
      file,
      `thumbnail/${uuid()}`,
      ext,
    );

    return result.path;
  }

  private async cleanupThumbnail(path: string): Promise<void> {
    try {
      await this.storage.deleteFile(path);
    } catch (error) {
      console.error("Failed to cleanup thumbnail:", {
        path,
        error,
      });
    }
  }
}
