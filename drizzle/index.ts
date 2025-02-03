import { Pool } from "pg";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env";

export const database = (
  options: {
    logger?: boolean;
  } = {}
) => {
  const connectionString = `postgresql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
  const pool = new Pool({
    connectionString,
  });
  const db = drizzle({ client: pool, schema, ...options });
  return db;
};
