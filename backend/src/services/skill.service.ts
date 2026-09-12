import { SkillRepository } from "@/repositories/skill.repository";
import type { SkillSchema } from "@/schemas/skill.schema";
import { Cache, ConflictError, Dependencies } from "@buntok/core";

@Dependencies(SkillRepository)
export class SkillService {
  private cache = new Cache();
  constructor(private skillRepository: SkillRepository) {}

  async getAllSkills() {
    const cached = await this.cache.get("skills");
    if (cached) return JSON.parse(cached as string);
    const skills = await this.skillRepository.findAllSkills();
    this.cache.set("skills", JSON.stringify(skills), 60 * 60);
    return skills;
  }

  async createSkill(data: SkillSchema) {
    const existingSkill = await this.skillRepository.findSkillByName(data.name);
    if (existingSkill) {
      throw new ConflictError("Skill with the same name already exists");
    }
    const result = await this.skillRepository.createSkill(data);
    if (result) this.cache.delete("skills");
    return result;
  }

  async updateSkill(skillID: string, data: SkillSchema) {
    const result = await this.skillRepository.updateSkill(skillID, data);
    if (result) this.cache.delete("skills");
    return result;
  }

  async deleteSkill(skillID: string) {
    const result = await this.skillRepository.deleteSkill(skillID);
    if (result) this.cache.delete("skills");
    return result;
  }
}
