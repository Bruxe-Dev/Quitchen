import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../db/db';
import { menuItem, menuCategory } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto';
import { AuthenticatedUser } from '../auth/types';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class MenuService {
    constructor(private readonly restaurantService: RestaurantService) { }

    // Get all menu items for a restaurant (public)
    async getMenuItems(restaurantId: string) {
        // Verify restaurant exists
        await this.restaurantService.getRestaurantById(restaurantId);

        return await db
            .select()
            .from(menuItem)
            .where(eq(menuItem.restaurantId, restaurantId));
    }

    // Get single menu item
    async getMenuItemById(itemId: string) {
        const item = await db
            .select()
            .from(menuItem)
            .where(eq(menuItem.id, itemId))
            .limit(1);

        if (item.length === 0) {
            throw new NotFoundException('Menu item not found');
        }

        return item[0];
    }

    // Create menu item (owner only)
    async createMenuItem(
        restaurantId: string,
        owner: AuthenticatedUser,
        createMenuItemDto: CreateMenuItemDto,
    ) {
        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(restaurantId);

        if (restaurant.ownerId !== owner.id) {
            throw new BadRequestException('You do not own this restaurant');
        }

        // Get first category or create default
        let category = await db
            .select()
            .from(menuCategory)
            .where(eq(menuCategory.restaurantId, restaurantId))
            .limit(1);

        let categoryId = category[0]?.id;

        if (!categoryId) {
            const newCategory = await db
                .insert(menuCategory)
                .values({
                    restaurantId,
                    name: 'General',
                    description: 'General menu items',
                })
                .returning();
            categoryId = newCategory[0].id;
        }

        const newItem = await db.insert(menuItem).values({
            restaurantId,
            categoryId,
            ...createMenuItemDto,
            currency: 'RWF',
        }).returning();

        return newItem[0];
    }

    // Update menu item (owner only)
    async updateMenuItem(
        itemId: string,
        owner: AuthenticatedUser,
        updateMenuItemDto: UpdateMenuItemDto,
    ) {
        const item = await this.getMenuItemById(itemId);

        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(item.restaurantId);

        if (restaurant.ownerId !== owner.id) {
            throw new BadRequestException('You do not own this restaurant');
        }

        const updated = await db
            .update(menuItem)
            .set(updateMenuItemDto)
            .where(eq(menuItem.id, itemId))
            .returning();

        return updated[0];
    }

    // Delete menu item (owner only)
    async deleteMenuItem(itemId: string, owner: AuthenticatedUser) {
        const item = await this.getMenuItemById(itemId);

        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(item.restaurantId);

        if (restaurant.ownerId !== owner.id) {
            throw new BadRequestException('You do not own this restaurant');
        }

        await db.delete(menuItem).where(eq(menuItem.id, itemId));

        return { message: 'Menu item deleted successfully' };
    }

    // Toggle availability (owner only)
    async toggleAvailability(itemId: string, owner: AuthenticatedUser) {
        const item = await this.getMenuItemById(itemId);

        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(item.restaurantId);

        if (restaurant.ownerId !== owner.id) {
            throw new BadRequestException('You do not own this restaurant');
        }

        const updated = await db
            .update(menuItem)
            .set({ isAvailable: !item.isAvailable })
            .where(eq(menuItem.id, itemId))
            .returning();

        return updated[0];
    }
}
