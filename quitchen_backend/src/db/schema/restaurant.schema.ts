import { pgTable, text, timestamp, boolean, jsonb, doublePrecision, integer } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const restaurant = pgTable('restaurant', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ownerId: text('owner_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' })
        .unique(), // One restaurant per owner account
    name: text('name').notNull(),
    description: text('description'),         // "About us" / specialities shown to customers
    cuisine: text('cuisine'),                 // e.g. "Italian", "Japanese", "Local"
    phone: text('phone'),
    address: text('address').notNull(),
    city: text('city').notNull(),
    country: text('country').notNull().default('Rwanda'),
    latitude: doublePrecision('latitude'),    // GPS coordinates for the map
    longitude: doublePrecision('longitude'),
    coverImage: text('cover_image'),          // URL to restaurant photo
    isActive: boolean('is_active').notNull().default(true),
    isApproved: boolean('is_approved').notNull().default(false), // Platform admin must approve
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// The seating map — stored as JSON because maps are flexible visual data
// Each "element" in the map could be a table, a wall, a bar counter, etc.
export const seatingMap = pgTable('seating_map', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    restaurantId: text('restaurant_id')
        .notNull()
        .references(() => restaurant.id, { onDelete: 'cascade' })
        .unique(), // Each restaurant has exactly one seating map
    // The map data: array of elements with position, size, type, label
    // Example: [{ id: "t1", type: "table", x: 100, y: 200, width: 80, height: 80, seats: 4, label: "Table 1" }]
    elements: jsonb('elements').notNull().default('[]'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Individual tables within the seating map — tracked separately for reservation logic
export const restaurantTable = pgTable('restaurant_table', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    restaurantId: text('restaurant_id')
        .notNull()
        .references(() => restaurant.id, { onDelete: 'cascade' }),
    tableNumber: text('table_number').notNull(), // e.g. "T1", "Bar-3", "Patio-2"
    seats: integer('seats').notNull(),
    isAvailable: boolean('is_available').notNull().default(true),
});