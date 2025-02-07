import { z } from "zod";
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, ".env") });

const schema = z.object({
  PM_DB_HOST: z.string(),
  PM_DB_USER: z.string(),
  PM_DB_PASS: z.string(),
  PM_DB_NAME: z.string(),
  PM_DB_PORT: z.string(),
});

export const env = schema.parse(process.env);
