import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { config as loadEnv } from "dotenv"
import { defineConfig } from "prisma/config"

/**
 * Repo uses `.env.development` / `.env.production` (no root `.env`).
 * `bun --env-file=... x prisma` does not reliably inject into this config file,
 * so load dotenv here explicitly.
 *
 * Examples:
 *   PRISMA_ENV_FILE=.env.production bunx prisma migrate deploy
 *   NODE_ENV=production bunx prisma migrate deploy
 *   bunx prisma migrate dev   # defaults to .env.development
 */
function loadPrismaEnv() {
  const candidates = [
    process.env.PRISMA_ENV_FILE,
    process.env.DOTENV_CONFIG_PATH,
    ".env",
    ".env.local",
    process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : null,
    ".env.development",
  ].filter((value): value is string => Boolean(value))

  for (const file of candidates) {
    const path = resolve(process.cwd(), file)
    if (!existsSync(path)) continue
    loadEnv({ path, override: false })
    if (process.env.DATABASE_URL) return path
  }

  return null
}

loadPrismaEnv()

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    seed: "bun run prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
})
