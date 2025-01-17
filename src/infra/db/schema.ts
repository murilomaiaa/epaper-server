import { pgTable, varchar, decimal, uuid, date } from 'drizzle-orm/pg-core';

export const documentsTable = pgTable('documents', {
  id: uuid().primaryKey(),
  url: varchar().notNull(),
  origin: varchar().notNull(),
  type: varchar().notNull(),
  issuer: varchar().notNull(),
  taxValue: decimal().notNull(),
  netValue: decimal().notNull(),
  createdAt: date().notNull(),
  updatedAt: date().notNull(),
});
