import { pgTable, uuid, varchar, doublePrecision, date, integer, timestamp, serial, bigint, boolean, foreignKey, char, unique, smallint, text, pgView } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const businessContributor = pgTable("business_contributor", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
	percentage: doublePrecision().notNull(),
	notes: varchar({ length: 2000 }),
	metadataCreatedat: date().notNull(),
	metadataCreatedby: uuid().notNull(),
	metadataUpdatedat: date().notNull(),
	metadataUpdatedby: uuid().notNull(),
	metadataDeletedat: date(),
	metadataDeletedby: uuid(),
});

export const flatRateWeight = pgTable("flat_rate_weight", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	trCode: varchar({ length: 50 }).notNull(),
	weightKg: integer().notNull(),
	metadataCreatedat: date().notNull(),
	metadataCreatedby: uuid().notNull(),
	metadataUpdatedat: date().notNull(),
	metadataUpdatedby: uuid().notNull(),
	metadataDeletedat: date(),
	metadataDeletedby: uuid(),
});

export const mantisConfiguration = pgTable("mantis_configuration", {
	id: uuid().primaryKey().notNull(),
	mantisLastImportMaxDate: timestamp({ mode: 'string' }).notNull(),
});

export const mantisSeverity = pgTable("mantis_severity", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	mantisSeverity: integer().notNull(),
	themeId: uuid().notNull(),
});

export const migrations = pgTable("migrations", {
	id: serial().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timestamp: bigint({ mode: "number" }).notNull(),
	name: varchar().notNull(),
});

export const product = pgTable("product", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
	code: varchar({ length: 10 }).notNull(),
	metadataCreatedat: date().notNull(),
	metadataCreatedby: uuid().notNull(),
	metadataUpdatedat: date().notNull(),
	metadataUpdatedby: uuid().notNull(),
	metadataDeletedat: date(),
	metadataDeletedby: uuid(),
});

export const application = pgTable("application", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
	isCommercial: boolean().notNull(),
});

export const timeInput = pgTable("time_input", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	at: timestamp({ mode: 'string' }).notNull(),
	minutes: integer().notNull(),
	description: varchar({ length: 1000 }).notNull(),
	mantisId: varchar({ length: 255 }),
	mantisNoteId: varchar({ length: 255 }),
	url: varchar({ length: 255 }),
	userStoryId: uuid(),
	userId: uuid().notNull(),
	customerId: uuid(),
	themeId: uuid(),
	sourceId: uuid(),
	applicationId: uuid(),
	contact: char({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.applicationId],
			foreignColumns: [application.id],
			name: "FK_4cb467273c0e3aad6a2b6809a00"
		}),
	foreignKey({
			columns: [table.sourceId],
			foreignColumns: [source.id],
			name: "FK_68070bc553dd8cfefa5415a5324"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "FK_7a41701af638619d4f640ea7629"
		}),
	foreignKey({
			columns: [table.themeId],
			foreignColumns: [theme.id],
			name: "FK_9d79824dbd1e9f02a8bd11434af"
		}),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customer.id],
			name: "FK_9f52bd42ebaa38034f2168004c6"
		}),
	foreignKey({
			columns: [table.userStoryId],
			foreignColumns: [userStory.id],
			name: "FK_feca94b4c597f3a77a76164112c"
		}),
]);

export const source = pgTable("source", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
});

export const user = pgTable("user", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	firstname: varchar({ length: 255 }).notNull(),
	lastname: varchar({ length: 255 }).notNull(),
	trigram: varchar({ length: 10 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	isExternal: boolean().notNull(),
});

export const project = pgTable("project", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
	estimatedDays: doublePrecision().notNull(),
	completedPercentage: doublePrecision().notNull(),
	isSpecific: boolean().notNull(),
	startDate: date(),
	endDate: date(),
	deletedAt: timestamp({ mode: 'string' }),
	status: varchar({ length: 15 }).default('CREATION').notNull(),
	timeSpent: smallint(),
	ratioHrsDays: doublePrecision().default(6).notNull(),
}, (table) => [
	unique("UQ_dedfea394088ed136ddadeee89c").on(table.name),
]);

export const userStory = pgTable("user_story", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	estimatedDays: doublePrecision().notNull(),
	acceptanceCriteria: text().notNull(),
	projectId: uuid().notNull(),
	deletedAt: timestamp({ mode: 'string' }),
	order: integer().notNull(),
	isDone: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "FK_82bf374c182b09d0bfcab6803f1"
		}),
]);

export const theme = pgTable("theme", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	code: varchar({ length: 5 }).notNull(),
	name: varchar({ length: 50 }).notNull(),
	isValued: boolean().notNull(),
});

export const customer = pgTable("customer", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	trigram: varchar({ length: 15 }).notNull(),
	name: varchar({ length: 50 }).notNull(),
});
export const timeextraction = pgView("timeextraction", {	at: date(),
	trigram: varchar({ length: 10 }),
	product: text(),
	theme: varchar({ length: 50 }),
	application: varchar(),
	customer: varchar({ length: 50 }),
	source: text(),
	duration: integer(),
	project: varchar(),
	projectAnalysis: text("project_analysis"),
	description: varchar({ length: 1000 }),
}).as(sql`SELECT s.at, s.trigram, s.product, s.theme, s.application, s.customer, s.source, s.duration, s.project, s.project_analysis, s.description FROM ( SELECT t.at::date AS at, u.trigram, ''::text AS product, theme.name AS theme, ''::character varying AS application, c.name AS customer, ''::text AS source, t.minutes AS duration, p.name AS project, ''::text AS project_analysis, t.description FROM time_input t LEFT JOIN "user" u ON u.id = t."userId" LEFT JOIN theme ON theme.id = t."themeId" JOIN user_story us ON us.id = t."userStoryId" LEFT JOIN customer c ON c.id = t."customerId" JOIN project p ON p.id = us."projectId" UNION SELECT t.at::date AS at, u.trigram, ''::text AS product, theme.name AS theme, a.name AS application, c.name AS customer, ''::text AS source, t.minutes AS duration, ''::character varying AS project, ''::text AS project_analysis, t.description FROM time_input t LEFT JOIN theme ON theme.id = t."themeId" LEFT JOIN application a ON a.id = t."applicationId" LEFT JOIN customer c ON c.id = t."customerId" LEFT JOIN "user" u ON u.id = t."userId" WHERE t."userStoryId" IS NULL) s ORDER BY s.project, s.at`);