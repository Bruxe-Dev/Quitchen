import { pgTable, text, timestamp, boolean, integer, doublePrecision } from 'drizzle-orm/pg-core';
import { restaurant } from './restaurant.schema';

export const menuCategory = pgTable('menu_category', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    restaurantId: text('restaurant_id')
        .notNull()
        .references(() => restaurant.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),       // e.g. "Starters", "Main Course", "Drinks"
    description: text('description'),
    sortOrder: integer('sort_order').notNull().default(0), // Controls display order
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const menuItem = pgTable('menu_item', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    categoryId: text('category_id')
        .notNull()
        .references(() => menuCategory.id, { onDelete: 'cascade' }),
    restaurantId: text('restaurant_id')
        .notNull()
        .references(() => restaurant.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    price: doublePrecision('price').notNull(),
    currency: text('currency').notNull().default('RWF'),
    image: text('image'),               // URL to food photo
    isAvailable: boolean('is_available').notNull().default(true),
    isSpecial: boolean('is_special').notNull().default(false), // "Chef's Special" flag
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});