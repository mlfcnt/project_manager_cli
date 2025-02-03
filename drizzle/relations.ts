import { relations } from "drizzle-orm/relations";
import { application, timeInput, source, user, theme, customer, userStory, project } from "./schema";

export const timeInputRelations = relations(timeInput, ({one}) => ({
	application: one(application, {
		fields: [timeInput.applicationId],
		references: [application.id]
	}),
	source: one(source, {
		fields: [timeInput.sourceId],
		references: [source.id]
	}),
	user: one(user, {
		fields: [timeInput.userId],
		references: [user.id]
	}),
	theme: one(theme, {
		fields: [timeInput.themeId],
		references: [theme.id]
	}),
	customer: one(customer, {
		fields: [timeInput.customerId],
		references: [customer.id]
	}),
	userStory: one(userStory, {
		fields: [timeInput.userStoryId],
		references: [userStory.id]
	}),
}));

export const applicationRelations = relations(application, ({many}) => ({
	timeInputs: many(timeInput),
}));

export const sourceRelations = relations(source, ({many}) => ({
	timeInputs: many(timeInput),
}));

export const userRelations = relations(user, ({many}) => ({
	timeInputs: many(timeInput),
}));

export const themeRelations = relations(theme, ({many}) => ({
	timeInputs: many(timeInput),
}));

export const customerRelations = relations(customer, ({many}) => ({
	timeInputs: many(timeInput),
}));

export const userStoryRelations = relations(userStory, ({one, many}) => ({
	timeInputs: many(timeInput),
	project: one(project, {
		fields: [userStory.projectId],
		references: [project.id]
	}),
}));

export const projectRelations = relations(project, ({many}) => ({
	userStories: many(userStory),
}));