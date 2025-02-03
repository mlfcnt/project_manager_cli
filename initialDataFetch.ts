import { database } from "./drizzle";

export const fetchInitialData = async () => {
  const db = database({
    logger: false,
  });

  const users = await db.query.user.findMany({
    columns: {
      id: true,
      trigram: true,
    },
  });

  const projects = await db.query.project.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  const themes = await db.query.theme.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  const applications = await db.query.application.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  const customers = await db.query.customer.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  const sources = await db.query.source.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  return { users, projects, themes, applications, customers, sources };
};
