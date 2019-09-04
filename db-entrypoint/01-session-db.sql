-- from https://github.com/voxpelli/node-connect-pg-simple/blob/HEAD/table.sql
-- as documented in https://www.npmjs.com/package/connect-pg-simple
CREATE DATABASE "session";
\connect "session";
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
