// This Schema will serve as to define restaurant complaints

import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { restaurant } from "./restaurant.schema";

export const complaint = pgTable('complaints', {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    restaurantId: uuid('restaurant_id')
        .notNull()
        .references(() => restaurant.id, { onDelete: 'cascade' }),
    subject: text('subject').notNull(),
    description: text('description').notNull(),
    status: text('status', {
        enum: ['open', 'under_review', 'resolved', 'closed']
    }).notNull().default('open'),
    adminResponse: text('admin_response'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})