import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { restaurant } from './restaurant.schema';

export const complaint = pgTable('complaint', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    restaurantId: text('restaurant_id')
        .notNull()
        .references(() => restaurant.id, { onDelete: 'cascade' }),
    subject: text('subject').notNull(),
    description: text('description').notNull(),
    status: text('status', {
        enum: ['open', 'under_review', 'resolved', 'closed']
    }).notNull().default('open'),
    adminResponse: text('admin_response'),  // Platform admin can reply
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});