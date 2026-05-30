import { pgTable, text, uuid, boolean, integer, timestamp, jsonb, doublePrecision } from 'drizzle-orm/pg-core'
import { restaurant } from './restaurant.schema'
import { restaurantTable } from './restaurant.schema'

export const order = pgTable('order', {
    id: uuid('id').primaryKey().defaultRandom(),
    restaurantId: uuid('restaurant_id')
        .notNull()
        .references(() => restaurant.id, { onDelete: 'cascade' }),
    tableId: uuid('table_id')
        .references(() => restaurantTable.id, { onDelete: 'set null' }),

    customerName: text('customer_name').notNull(),
    customerPhone: text('customer_phone').notNull(),
    customerEmail: text('customer_email'),
    items: jsonb('items').notNull(),

    totalAmount: doublePrecision('total_amount').notNull(),
    currency: text('currency').notNull().default('RWF'),

    status: text('status', {
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled']
    }).notNull().default('pending'),

    type: text('type', {
        enum: ['dine_in', 'takeaway']
    }).notNull().default('dine_in'),

    specialRequests: text('special_requests'),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Individual line items — for easy querying of "what was ordered"
export const orderItem = pgTable('order_item', {
    id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: uuid('order_id')
        .notNull()
        .references(() => order.id, { onDelete: 'cascade' }),
    menuItemId: uuid('menu_item_id').notNull(), //
    menuItemName: text('menu_item_name').notNull(),   // Snapshot at order time
    menuItemPrice: doublePrecision('menu_item_price').notNull(), // Snapshot at order time
    quantity: integer('quantity').notNull(),
    subtotal: doublePrecision('subtotal').notNull(),
});