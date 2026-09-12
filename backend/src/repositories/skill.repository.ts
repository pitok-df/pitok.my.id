import { prisma } from "@/libs/prisma";
import type { SkillSchema } from "@/schemas/skill.schema";

export class SkillRepository {
  async findAllSkills() {
    return prisma.skill.findMany();
  }

  async createSkill(data: SkillSchema) {
    return prisma.skill.create({ data });
  }

  async updateSkill(skillID: string, data: SkillSchema) {
    return prisma.skill.update({ where: { id: skillID }, data });
  }

  async deleteSkill(skillID: string) {
    return prisma.skill.delete({ where: { id: skillID } });
  }

  async findSkillByName(name: string) {
    return await prisma.skill.findFirst({
      where: { name },
    });
  }
}
