import { prisma } from "@/libs/prisma";
import type { CreateSkillInput, UpdateSkillInput } from "./skill.schema";

export class SkillRepository {
  async findAllSkills() {
    return prisma.skill.findMany();
  }

  async createSkill(data: CreateSkillInput) {
    return prisma.skill.create({ data });
  }

  async updateSkill(skillID: string, data: UpdateSkillInput) {
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
