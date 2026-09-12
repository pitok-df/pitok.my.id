import { env } from "@/env";
import { JwtService } from "@buntok/core";

export const jwt = new JwtService(env.JWT_SECRET!);
