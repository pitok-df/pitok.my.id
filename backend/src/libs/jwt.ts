import { env } from "@/env";
import { JwtService } from "@buntok/core/auth";

export const jwt = new JwtService(env.JWT_SECRET!);
