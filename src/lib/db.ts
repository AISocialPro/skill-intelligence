// src/lib/db.ts
/**
 * Minimal "db" stub to prevent module-not-found errors.
 * Replace with Prisma/Drizzle later when you connect a real DB.
 */
export const db = {
  assessment: {
    findMany: async (_args?: any) => [],
    create: async (args?: any) => args?.data ?? null,
  },
  track: {
    findMany: async (_args?: any) => [],
  },
  skill: {
    findMany: async (_args?: any) => [],
  },
};
