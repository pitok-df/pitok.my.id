import { env } from "@/env";
import {
  Context,
  Controller,
  Delete,
  Dependencies,
  Get,
  Patch,
  Post,
  requireAuth,
  Use,
  type ZodCtx,
} from "@buntok/core";
import { SkillService } from "./skill.service";
import {
  CreateSkillSchema,
  UpdateSkillSchema,
  type CreateSkillInput,
  type UpdateSkillInput,
} from "./skill.schema";
import { z, zValidator } from "@buntok/core/middlewares/validator";

@Dependencies(SkillService)
@Controller("/skills")
export class SkillController {
  constructor(private skillService: SkillService) {}

  @Get("/")
  async getAllSkills(ctx: Context) {
    const skills = await this.skillService.getAllSkills();
    return ctx.success(skills, "Skills retrieved successfully");
  }

  @Post("/")
  @Use(requireAuth(env.JWT_SECRET!))
  @Use(zValidator("body", CreateSkillSchema))
  async createSkill(ctx: ZodCtx<{ body: CreateSkillInput }>) {
    const data = ctx.valid("body");
    const skill = await this.skillService.createSkill(data);
    return ctx.success(skill, "Skill created successfully");
  }

  @Delete("/:skillID")
  @Use(requireAuth(env.JWT_SECRET!))
  @Use(zValidator("params", { skillID: z.string() }))
  async deleteSkill(ctx: ZodCtx<{ params: { skillID: string } }>) {
    const { skillID } = ctx.valid("params");
    const skill = await this.skillService.deleteSkill(skillID);
    return ctx.success(skill, "Skill deleted successfully");
  }

  @Patch("/:skillID")
  @Use(requireAuth(env.JWT_SECRET!))
  @Use(zValidator("params", { skillID: z.string() }))
  @Use(zValidator("body", UpdateSkillSchema))
  async updateSkill(
    ctx: ZodCtx<{ params: { skillID: string }; body: UpdateSkillInput }>,
  ) {
    const { skillID } = ctx.valid("params");
    const data = ctx.valid("body");
    const skill = await this.skillService.updateSkill(skillID, data);
    return ctx.success(skill, "Skill updated successfully");
  }
}
