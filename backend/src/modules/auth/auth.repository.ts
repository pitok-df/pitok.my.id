import type { User } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";

export class AuthRepository {
  private prisma = prisma;

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });
  }

  getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
  }
}
