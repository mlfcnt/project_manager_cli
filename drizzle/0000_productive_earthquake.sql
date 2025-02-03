-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "business_contributor" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(50) NOT NULL,
	"percentage" double precision NOT NULL,
	"notes" varchar(2000),
	"metadataCreatedat" date NOT NULL,
	"metadataCreatedby" uuid NOT NULL,
	"metadataUpdatedat" date NOT NULL,
	"metadataUpdatedby" uuid NOT NULL,
	"metadataDeletedat" date,
	"metadataDeletedby" uuid
);
--> statement-breakpoint
CREATE TABLE "flat_rate_weight" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"trCode" varchar(50) NOT NULL,
	"weightKg" integer NOT NULL,
	"metadataCreatedat" date NOT NULL,
	"metadataCreatedby" uuid NOT NULL,
	"metadataUpdatedat" date NOT NULL,
	"metadataUpdatedby" uuid NOT NULL,
	"metadataDeletedat" date,
	"metadataDeletedby" uuid
);
--> statement-breakpoint
CREATE TABLE "mantis_configuration" (
	"id" uuid PRIMARY KEY NOT NULL,
	"mantisLastImportMaxDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mantis_severity" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"mantisSeverity" integer NOT NULL,
	"themeId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" bigint NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(50) NOT NULL,
	"code" varchar(10) NOT NULL,
	"metadataCreatedat" date NOT NULL,
	"metadataCreatedby" uuid NOT NULL,
	"metadataUpdatedat" date NOT NULL,
	"metadataUpdatedby" uuid NOT NULL,
	"metadataDeletedat" date,
	"metadataDeletedby" uuid
);
--> statement-breakpoint
CREATE TABLE "application" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(50) NOT NULL,
	"isCommercial" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_input" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"at" timestamp NOT NULL,
	"minutes" integer NOT NULL,
	"description" varchar(1000) NOT NULL,
	"mantisId" varchar(255),
	"mantisNoteId" varchar(255),
	"url" varchar(255),
	"userStoryId" uuid,
	"userId" uuid NOT NULL,
	"customerId" uuid,
	"themeId" uuid,
	"sourceId" uuid,
	"applicationId" uuid,
	"contact" char(255)
);
--> statement-breakpoint
CREATE TABLE "source" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"trigram" varchar(10) NOT NULL,
	"email" varchar(255) NOT NULL,
	"isExternal" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(50) NOT NULL,
	"estimatedDays" double precision NOT NULL,
	"completedPercentage" double precision NOT NULL,
	"isSpecific" boolean NOT NULL,
	"startDate" date,
	"endDate" date,
	"deletedAt" timestamp,
	"status" varchar(15) DEFAULT 'CREATION' NOT NULL,
	"timeSpent" smallint,
	"ratioHrsDays" double precision DEFAULT 6 NOT NULL,
	CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_story" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255) NOT NULL,
	"estimatedDays" double precision NOT NULL,
	"acceptanceCriteria" text NOT NULL,
	"projectId" uuid NOT NULL,
	"deletedAt" timestamp,
	"order" integer NOT NULL,
	"isDone" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "theme" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"code" varchar(5) NOT NULL,
	"name" varchar(50) NOT NULL,
	"isValued" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"trigram" varchar(15) NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "time_input" ADD CONSTRAINT "FK_4cb467273c0e3aad6a2b6809a00" FOREIGN KEY ("applicationId") REFERENCES "public"."application"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_input" ADD CONSTRAINT "FK_68070bc553dd8cfefa5415a5324" FOREIGN KEY ("sourceId") REFERENCES "public"."source"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_input" ADD CONSTRAINT "FK_7a41701af638619d4f640ea7629" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_input" ADD CONSTRAINT "FK_9d79824dbd1e9f02a8bd11434af" FOREIGN KEY ("themeId") REFERENCES "public"."theme"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_input" ADD CONSTRAINT "FK_9f52bd42ebaa38034f2168004c6" FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_input" ADD CONSTRAINT "FK_feca94b4c597f3a77a76164112c" FOREIGN KEY ("userStoryId") REFERENCES "public"."user_story"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_story" ADD CONSTRAINT "FK_82bf374c182b09d0bfcab6803f1" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."timeextraction" AS (SELECT s.at, s.trigram, s.product, s.theme, s.application, s.customer, s.source, s.duration, s.project, s.project_analysis, s.description FROM ( SELECT t.at::date AS at, u.trigram, ''::text AS product, theme.name AS theme, ''::character varying AS application, c.name AS customer, ''::text AS source, t.minutes AS duration, p.name AS project, ''::text AS project_analysis, t.description FROM time_input t LEFT JOIN "user" u ON u.id = t."userId" LEFT JOIN theme ON theme.id = t."themeId" JOIN user_story us ON us.id = t."userStoryId" LEFT JOIN customer c ON c.id = t."customerId" JOIN project p ON p.id = us."projectId" UNION SELECT t.at::date AS at, u.trigram, ''::text AS product, theme.name AS theme, a.name AS application, c.name AS customer, ''::text AS source, t.minutes AS duration, ''::character varying AS project, ''::text AS project_analysis, t.description FROM time_input t LEFT JOIN theme ON theme.id = t."themeId" LEFT JOIN application a ON a.id = t."applicationId" LEFT JOIN customer c ON c.id = t."customerId" LEFT JOIN "user" u ON u.id = t."userId" WHERE t."userStoryId" IS NULL) s ORDER BY s.project, s.at);
*/