import { App } from "@buntok/core";
import { z } from "@buntok/core/middlewares/validator";

export const env = App.validateEnv({
  PORT: z.coerce.number().default(1212),
  JWT_SECRET: z.string().optional(),
  AUTH_STORE: z.enum(["header", "cookie"]).default("header"),
  AUTH_COOKIE: z.string().default("session"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.url().optional(),
});
