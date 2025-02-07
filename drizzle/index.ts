import { Pool } from "pg";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env";

export const database = (
  options: {
    logger?: boolean;
  } = {}
) => {
  const connectionString = `postgresql://${env.PM_DB_USER}:${env.PM_DB_PASS}@${env.PM_DB_HOST}:${env.PM_DB_PORT}/${env.PM_DB_NAME}`;
  const pool = new Pool({
    connectionString,
  });
  const db = drizzle({ client: pool, schema, ...options });
  return db;
};
