import { env } from "@/env";
import {
  skillSchema,
  skillUpdateSchema,
  type SkillSchema,
} from "@/schemas/skill.schema";
import { SkillService } from "@/services/skill.service";
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
  z,
  zValidator,
  type ZodCtx,
} from "@buntok/core";

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
  @Use(requireAuth(env.JWT_SECRET))
  @Use(zValidator("body", skillSchema))
  async createSkill(ctx: ZodCtx<{ body: SkillSchema }>) {
    const data = ctx.valid("body");
    const skill = await this.skillService.createSkill(data);
    return ctx.success(skill, "Skill created successfully");
  }

  @Delete("/:skillID")
  @Use(requireAuth(env.JWT_SECRET))
  @Use(zValidator("params", { skillID: z.string() }))
  async deleteSkill(ctx: ZodCtx<{ params: { skillID: string } }>) {
    const { skillID } = ctx.valid("params");
    const skill = await this.skillService.deleteSkill(skillID);
    return ctx.success(skill, "Skill deleted successfully");
  }

  @Patch("/:skillID")
  @Use(requireAuth(env.JWT_SECRET))
  @Use(zValidator("params", { skillID: z.string() }))
  @Use(zValidator("body", skillUpdateSchema))
  async updateSkill(
    ctx: ZodCtx<{ params: { skillID: string }; body: SkillSchema }>,
  ) {
    const { skillID } = ctx.valid("params");
    const data = ctx.valid("body");
    const skill = await this.skillService.updateSkill(skillID, data);
    return ctx.success(skill, "Skill updated successfully");
  }
}
