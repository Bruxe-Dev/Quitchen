import { pgTable, text, timestamp, doublePrecision, integer, jsonb } from 'drizzle-orm/pg-core';
import { restaurant } from './restaurant.schema';
import { restaurantTable } from './restaurant.schema';

export const order = pgTable('order', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    restaurantId: text('restaurant_id')
        .notNull()
        .references(() => restaurant.id, { onDelete: 'cascade' }),
    tableId: text('table_id')
        .references(() => restaurantTable.id, { onDelete: 'set null' }),

    // Customer info — captured at order time, no account needed
    customerName: text('customer_name').notNull(),
    customerPhone: text('customer_phone').notNull(),
    customerEmail: text('customer_email'),

    // Order items snapshot — stored as JSON so price/name changes don't affect history
    // Example: [{ menuItemId: "x", name: "Jollof Rice", price: 3500, quantity: 2 }]
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
    notes: text('notes'), // Staff notes
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Individual line items — for easy querying of "what was ordered"
export const orderItem = pgTable('order_item', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id')
        .notNull()
        .references(() => order.id, { onDelete: 'cascade' }),
    menuItemId: text('menu_item_id').notNull(), // Reference only, no FK so menu changes don't break history
    menuItemName: text('menu_item_name').notNull(),   // Snapshot at order time
    menuItemPrice: doublePrecision('menu_item_price').notNull(), // Snapshot at order time
    quantity: integer('quantity').notNull(),
    subtotal: doublePrecision('subtotal').notNull(),
});