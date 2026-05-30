import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { restaurant } from './restaurant.schema';
import { restaurantTable } from './restaurant.schema';

export const reservation = pgTable('reservation', {
    id: uuid('id').primaryKey().defaultRandom(),
    restaurantId: uuid('restaurant_id')
        .notNull()
        .references(() => restaurant.id, { onDelete: 'cascade' }),
    tableId: uuid('table_id')
        .references(() => restaurantTable.id, { onDelete: 'set null' }),

    customerName: text('customer_name').notNull(),
    customerPhone: text('customer_phone').notNull(),
    customerEmail: text('customer_email'),

    partySize: integer('party_size').notNull(),
    reservationDate: timestamp('reservation_date').notNull(),  // When they want to come
    specialRequests: text('special_requests'),

    status: text('status', {
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show']
    }).notNull().default('pending'),

    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});