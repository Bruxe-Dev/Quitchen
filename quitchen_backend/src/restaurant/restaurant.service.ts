import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../db/db';
import { restaurant, restaurantTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';
import { AuthenticatedUser } from '../auth/types';

@Injectable()
export class RestaurantService {
    // Create a restaurant (only restaurant owners)
    async createRestaurant(
        owner: AuthenticatedUser,
        createRestaurantDto: CreateRestaurantDto,
    ) {
        if (owner.role !== 'restaurant_owner') {
            throw new BadRequestException('Only restaurant owners can create restaurants');
        }

        // Check if owner already has a restaurant
        const existingRestaurant = await db
            .select()
            .from(restaurant)
            .where(eq(restaurant.ownerId, owner.id))
            .limit(1);

        if (existingRestaurant.length > 0) {
            throw new BadRequestException('You already have a restaurant');
        }

        const newRestaurant = await db.insert(restaurant).values({
            ownerId: owner.id,
            ...createRestaurantDto,
            country: 'Rwanda',
        }).returning();

        return newRestaurant[0];
    }

    // Get all restaurants (public - no auth needed)
    async getAllRestaurants(approved: boolean = true) {
        const query = db.select().from(restaurant);

        if (approved) {
            return await query.where(eq(restaurant.isApproved, true));
        }

        return await query;
    }

    // Get a single restaurant by ID
    async getRestaurantById(id: string) {
        const result = await db
            .select()
            .from(restaurant)
            .where(eq(restaurant.id, id))
            .limit(1);

        if (result.length === 0) {
            throw new NotFoundException('Restaurant not found');
        }

        return result[0];
    }

    // Get my restaurant (owner only)
    async getMyRestaurant(owner: AuthenticatedUser) {
        const result = await db
            .select()
            .from(restaurant)
            .where(eq(restaurant.ownerId, owner.id))
            .limit(1);

        if (result.length === 0) {
            throw new NotFoundException('You do not have a restaurant');
        }

        return result[0];
    }

    // Update restaurant (owner only)
    async updateRestaurant(
        restaurantId: string,
        owner: AuthenticatedUser,
        updateRestaurantDto: UpdateRestaurantDto,
    ) {
        // Verify ownership
        const rest = await this.getRestaurantById(restaurantId);

        if (rest.ownerId !== owner.id && owner.role !== 'platform_admin') {
            throw new BadRequestException('You do not have permission to update this restaurant');
        }

        const updated = await db
            .update(restaurant)
            .set(updateRestaurantDto)
            .where(eq(restaurant.id, restaurantId))
            .returning();

        return updated[0];
    }

    // Get restaurant tables
    async getRestaurantTables(restaurantId: string) {
        return await db
            .select()
            .from(restaurantTable)
            .where(eq(restaurantTable.restaurantId, restaurantId));
    }

    // Create a table
    async createTable(
        restaurantId: string,
        owner: AuthenticatedUser,
        tableData: { tableNumber: string; seats: number },
    ) {
        // Verify ownership
        const rest = await this.getRestaurantById(restaurantId);

        if (rest.ownerId !== owner.id) {
            throw new BadRequestException('You do not own this restaurant');
        }

        const newTable = await db.insert(restaurantTable).values({
            restaurantId,
            ...tableData,
        }).returning();

        return newTable[0];
    }

    // Delete table
    async deleteTable(tableId: string, owner: AuthenticatedUser) {
        // Get the table first
        const table = await db
            .select()
            .from(restaurantTable)
            .where(eq(restaurantTable.id, tableId))
            .limit(1);

        if (table.length === 0) {
            throw new NotFoundException('Table not found');
        }

        // Verify ownership of the restaurant
        const rest = await this.getRestaurantById(table[0].restaurantId);

        if (rest.ownerId !== owner.id) {
            throw new BadRequestException('You do not own this restaurant');
        }

        await db.delete(restaurantTable).where(eq(restaurantTable.id, tableId));

        return { message: 'Table deleted successfully' };
    }
}
