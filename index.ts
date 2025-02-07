import { database } from "./drizzle";
import prompts from "prompts";
import { fetchInitialData } from "./initialDataFetch";
import { timeInput } from "./drizzle/schema";

const main = async () => {
  const db = database({
    logger: false,
  });

  const { users, projects, applications, customers, sources, themes } =
    await fetchInitialData();

  const { shouldContinue } = await prompts({
    type: "confirm",
    name: "shouldContinue",
    message: "Souhaitez-vous entrer vos temps sur project manager ?",
    initial: true,
  });

  if (!shouldContinue) {
    process.exit(0);
  }

  const { userId, projectId } = await prompts(
    [
      {
        type: "autocomplete",
        name: "userId",
        message: "Pour quel utilisateur ?",
        choices: users.map((user) => ({ title: user.trigram, value: user.id })),
      },
      {
        type: "autocomplete",
        name: "projectId",
        message: "Pour quel projet ?",
        choices: projects.map((project) => ({
          title: project.name,
          value: project.id,
        })),
      },
    ],
    {
      onCancel: () => {
        console.log("Bye!");
        process.exit(0);
      },
    }
  );

  const userStories = await db.query.userStory.findMany({
    columns: {
      id: true,
      name: true,
    },
    where: (userStory, { eq }) => eq(userStory.projectId, projectId),
  });

  const {
    userStoryId,
    themeId,
    applicationId,
    customerId,
    sourceId,
    minutes,
    description,
  } = await prompts(
    [
      {
        type: "autocomplete",
        name: "userStoryId",
        message: "Pour quelle user story ?",
        choices: userStories.map((userStory) => ({
          title: userStory.name,
          value: userStory.id,
        })),
      },
      {
        type: "autocomplete",
        name: "themeId",
        message: "Pour quel thème ?",
        initial: themes.find((x) => x.name === "Development")?.id,
        choices: themes.map((theme) => ({
          title: theme.name,
          value: theme.id,
        })),
      },
      {
        type: "autocomplete",
        name: "applicationId",
        message: "Pour quelle application ?",
        initial: applications.find((x) => x.name === "AWA")?.id,
        choices: applications.map((application) => ({
          title: application.name,
          value: application.id,
        })),
      },
      {
        type: "autocomplete",
        name: "customerId",
        message: "Pour quel client ?",
        initial: customers.find((x) => x.name === "ADSoftware")?.id,
        choices: customers.map((customer) => ({
          title: customer.name,
          value: customer.id,
        })),
      },
      {
        type: "autocomplete",
        name: "sourceId",
        message: "Pour quelle source ?",
        initial: sources.find((x) => x.name === "Gitlab")?.id,
        choices: sources.map((source) => ({
          title: source.name,
          value: source.id,
        })),
      },
      {
        type: "number",
        name: "minutes",
        message: "Combien de minutes ?",
      },
      {
        type: "text",
        name: "description",
        message: "Description",
      },
    ],
    {
      onCancel: () => {
        console.log("Bye!");
        process.exit(0);
      },
    }
  );

  await db.insert(timeInput).values({
    at: new Date().toISOString(),
    minutes,
    description,
    userId,
    userStoryId,
    themeId,
    applicationId,
    customerId,
    sourceId,
  });

  console.log(
    `Temps enregistrés et visibles via https://project-manager.adsoftware-tech.com/projects/${projectId}/backlog/${userStoryId}`
  );

  const { addAgileTime } = await prompts({
    type: "confirm",
    name: "addAgileTime",
    message: `Voulez-vous rajouter 10% (${Math.round(
      minutes * 0.1
    )} minutes) de ce temps en Agile/Réunion ?`,
    initial: false,
  });

  if (addAgileTime) {
    const { agileDescription } = await prompts({
      type: "text",
      name: "agileDescription",
      message: "Description pour le temps Agile/Réunion",
      initial: "Temps Agile/Réunion",
    });

    await db.insert(timeInput).values({
      at: new Date().toISOString(),
      minutes: Math.round(minutes * 0.1),
      description: agileDescription,
      userId,
      themeId: themes.find((x) => x.name === "Agile")?.id,
      applicationId,
      customerId,
      sourceId,
    });

    console.log(
      `Temps Agile/Réunion enregistrés et visibles via https://project-manager.adsoftware-tech.com/times`
    );
  }

  process.exit(0);
};

main().catch(console.error);
