import {
  Dependencies,
  Controller,
  Get,
  Context,
  Post,
  Use,
  type ZodCtx,
  Delete,
  Patch,
} from "@buntok/core";
import { ProjectService } from "./project.service";
import { zValidator } from "@buntok/core/middlewares/validator";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "./project.schema";
import { requireAuth } from "@buntok/core";
import { env } from "@/env";

@Dependencies(ProjectService)
@Controller("/projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get("/")
  async getAll(ctx: Context) {
    const projects = await this.projectService.getAll();
    return ctx.success(projects);
  }

  @Post("/")
  @Use(requireAuth(env.JWT_SECRET!))
  @Use(
    zValidator("body", CreateProjectSchema, {
      contentType: "multipart/form-data",
    }),
  )
  async save(ctx: ZodCtx<{ body: CreateProjectInput }>) {
    const data = ctx.valid("body");
    const result = await this.projectService.save(data);
    return ctx.success(result, "Project has successfully created.");
  }

  @Delete("/:id")
  @Use(requireAuth(env.JWT_SECRET!))
  async delete(ctx: Context) {
    const projectId = ctx.params.id as string;
    const result = await this.projectService.delete(projectId);
    return ctx.success(result, "Project has successfully deleted.");
  }

  @Patch("/:id")
  @Use(requireAuth(env.JWT_SECRET!))
  @Use(
    zValidator("body", UpdateProjectSchema, {
      contentType: "multipart/form-data",
    }),
  )
  async update(ctx: ZodCtx<{ body: UpdateProjectInput }>) {
    const projectId = ctx.params.id as string;
    const data = ctx.valid("body");
    const result = await this.projectService.update(projectId, data);
    return ctx.success(result, "Project has successfully updated.");
  }
}
