import { Pool } from "pg";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";

export const database = (
  options: {
    logger?: boolean;
  } = {}
) => {
  const connectionString = `postgresql://${Bun.env.DB_USER}:${Bun.env.DB_PASS}@${Bun.env.DB_HOST}:${Bun.env.DB_PORT}/${Bun.env.DB_NAME}`;
  const pool = new Pool({
    connectionString,
  });
  const db = drizzle({ client: pool, schema, ...options });
  return db;
};
