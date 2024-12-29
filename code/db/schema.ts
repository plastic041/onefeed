import { integer, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  googleId: varchar().notNull(),
  username: varchar().notNull(),
});

export const sessionTable = pgTable("session", {
  id: varchar().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expiresAt", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: varchar(),
  imageuuid: varchar().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  userId: integer()
    .references(() => usersTable.id)
    .notNull(),
});
