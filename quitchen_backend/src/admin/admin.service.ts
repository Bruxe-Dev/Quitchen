import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../db/db';
import { user, restaurant } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AuthenticatedUser } from '../auth/types';

@Injectable()
export class AdminService {
    // Get all users (admin only)
    async getAllUsers(admin: AuthenticatedUser) {
        if (admin.role !== 'platform_admin') {
            throw new BadRequestException('Only platform admins can access this');
        }

        return await db.select().from(user);
    }

    // Get all restaurants (admin only)
    async getAllRestaurants(admin: AuthenticatedUser) {
        if (admin.role !== 'platform_admin') {
            throw new BadRequestException('Only platform admins can access this');
        }

        return await db.select().from(restaurant);
    }

    // Get pending restaurants (admin only)
    async getPendingRestaurants(admin: AuthenticatedUser) {
        if (admin.role !== 'platform_admin') {
            throw new BadRequestException('Only platform admins can access this');
        }

        return await db
            .select()
            .from(restaurant)
            .where(eq(restaurant.isApproved, false));
    }

    // Approve restaurant (admin only)
    async approveRestaurant(restaurantId: string, admin: AuthenticatedUser) {
        if (admin.role !== 'platform_admin') {
            throw new BadRequestException('Only platform admins can access this');
        }

        const updated = await db
            .update(restaurant)
            .set({ isApproved: true })
            .where(eq(restaurant.id, restaurantId))
            .returning();

        if (updated.length === 0) {
            throw new NotFoundException('Restaurant not found');
        }

        return updated[0];
    }

    // Reject restaurant (admin only)
    async rejectRestaurant(restaurantId: string, admin: AuthenticatedUser) {
        if (admin.role !== 'platform_admin') {
            throw new BadRequestException('Only platform admins can access this');
        }

        const updated = await db
            .update(restaurant)
            .set({ isApproved: false })
            .where(eq(restaurant.id, restaurantId))
            .returning();

        if (updated.length === 0) {
            throw new NotFoundException('Restaurant not found');
        }

        return updated[0];
    }

    // Deactivate restaurant (admin only)
    async deactivateRestaurant(restaurantId: string, admin: AuthenticatedUser) {
        if (admin.role !== 'platform_admin') {
            throw new BadRequestException('Only platform admins can access this');
        }

        const updated = await db
            .update(restaurant)
            .set({ isActive: false })
            .where(eq(restaurant.id, restaurantId))
            .returning();

        if (updated.length === 0) {
            throw new NotFoundException('Restaurant not found');
        }

        return updated[0];
    }

    // Get platform statistics (admin only)
    async getPlatformStats(admin: AuthenticatedUser) {
        if (admin.role !== 'platform_admin') {
            throw new BadRequestException('Only platform admins can access this');
        }

        const users = await db.select().from(user);
        const restaurants = await db.select().from(restaurant);

        const stats = {
            totalUsers: users.length,
            restaurantOwners: users.filter(u => u.role === 'restaurant_owner').length,
            admins: users.filter(u => u.role === 'platform_admin').length,
            totalRestaurants: restaurants.length,
            approvedRestaurants: restaurants.filter(r => r.isApproved).length,
            pendingRestaurants: restaurants.filter(r => !r.isApproved).length,
            activeRestaurants: restaurants.filter(r => r.isActive).length,
        };

        return stats;
    }
}
