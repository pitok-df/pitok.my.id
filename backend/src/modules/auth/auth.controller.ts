import { env } from "@/env";
import {
  Context,
  Controller,
  deleteCookie,
  Dependencies,
  Get,
  Post,
  requireAuth,
  setCookie,
  Use,
  type ZodCtx,
} from "@buntok/core";
import { AuthService } from "./auth.service";
import { loginSchema, type LoginSchema } from "./auth.schema";
import { zValidator } from "@buntok/core/middlewares/validator";

@Dependencies(AuthService)
@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  @Use(zValidator("body", loginSchema))
  async login(ctx: ZodCtx<{ body: LoginSchema }>) {
    const data = ctx.valid("body");

    const token = await this.authService.login(data);

    const res = ctx.success({ token }, "Login successful");

    return setCookie(res, "session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
      ...(env.NODE_ENV === "production" && { domain: "pitok.my.id" }),
    });
  }

  @Post("/logout")
  async logout(ctx: Context) {
    return deleteCookie(
      ctx.success({ message: "Logout successful" }),
      "session",
    );
  }

  @Get("/me")
  @Use(requireAuth(env.JWT_SECRET!))
  async me(ctx: Context) {
    const userId = ctx.user?.id;

    const user = await this.authService.me(userId as string);

    return ctx.success(user, "User retrieved successfully");
  }
}
