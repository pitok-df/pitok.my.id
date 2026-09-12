import { jwt } from "@/libs/jwt";
import { AuthRepository } from "@/repositories/auth.repository";
import type { LoginSchema } from "@/schemas/auth.schema";
import { Dependencies, UnauthorizedError, verifyPassword } from "@buntok/core";

@Dependencies(AuthRepository)
export class AuthService {
  constructor(private authRepo: AuthRepository) {}

  async login(data: LoginSchema) {
    const user = await this.authRepo.findUserByEmail(data.email);

    if (!user) throw new UnauthorizedError("Invalid email or password");

    const isValid = await verifyPassword(data.password, user.password);

    if (!isValid) throw new UnauthorizedError("Invalid email or password");

    const token = await jwt.sign(user, 1000 * 60 * 60 * 24);

    return token;
  }

  async me(userId: string) {
    const user = await this.authRepo.getMe(userId);
    return user;
  }
}
