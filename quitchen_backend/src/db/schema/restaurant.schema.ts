import { pgTable, text, timestamp, boolean, jsonb, doublePrecision, integer, uuid } from "drizzle-orm/pg-core";
import { user } from './auth.schema'

export const restaurant = pgTable('restaurant', {
    id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ownerId: uuid('owner_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' })
        .unique(),
    name: text('name').notNull(),
    description: text('description'),
    cuisine: text('cuisine'),
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

export const seatingMap = pgTable('seating_map', {
    id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    restaurantId: uuid('restaurant_id')
        .notNull()
        .references(() => restaurant.id, { onDelete: 'cascade' })
        .unique(),
    elements: jsonb('elements').notNull().default('[]'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const restaurantTable = pgTable('restaurant_table', {
    id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    restaurantId: uuid('restaurant_id')
        .notNull()
        .unique()
        .references(() => restaurant.id, { onDelete: 'cascade' }),
    tableNumber: integer('table_number').notNull(),
    seats: integer('seats').notNull(),
    isAvailable: boolean('is_available').notNull().default(true)
})