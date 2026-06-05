import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/db';
import { restaurant, menuItem, reservation, order } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CustomerService {
    // Search restaurants by name or cuisine
    async searchRestaurants(searchTerm: string) {
        // Get approved restaurants only
        const allRestaurants = await db
            .select()
            .from(restaurant)
            .where(eq(restaurant.isApproved, true));

        // Simple search filter
        return allRestaurants.filter(
            r =>
                r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.city.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }

    // Get restaurants by city
    async getRestaurantsByCity(city: string) {
        return await db
            .select()
            .from(restaurant)
            .where(eq(restaurant.city, city));
    }

    // Get restaurant detail
    async getRestaurantDetail(restaurantId: string) {
        const restaurantData = await db
            .select()
            .from(restaurant)
            .where(eq(restaurant.id, restaurantId))
            .limit(1);

        if (restaurantData.length === 0) {
            throw new NotFoundException('Restaurant not found');
        }

        // Get menu items
        const menuItems = await db
            .select()
            .from(menuItem)
            .where(eq(menuItem.restaurantId, restaurantId));

        // Get available tables
        const tables = await db.query.restaurantTable.findMany({
            where: (table, { eq }) => eq(table.restaurantId, restaurantId),
        });

        return {
            ...restaurantData[0],
            menuItems,
            tables,
        };
    }

    // Get restaurant reviews/ratings (placeholder for future implementation)
    async getRestaurantReviews(restaurantId: string) {
        // This would connect to a reviews table in the future
        return {
            restaurantId,
            averageRating: 4.5,
            totalReviews: 0,
            reviews: [],
        };
    }

    // Get my orders (for registered customers)
    async getMyOrders(customerPhone: string) {
        return await db
            .select()
            .from(order)
            .where(eq(order.customerPhone, customerPhone));
    }

    // Get my reservations (for registered customers)
    async getMyReservations(customerPhone: string) {
        return await db
            .select()
            .from(reservation)
            .where(eq(reservation.customerPhone, customerPhone));
    }

    // Get order tracking details
    async trackOrder(orderId: string) {
        const orderData = await db
            .select()
            .from(order)
            .where(eq(order.id, orderId))
            .limit(1);

        if (orderData.length === 0) {
            throw new NotFoundException('Order not found');
        }

        return {
            id: orderData[0].id,
            status: orderData[0].status,
            totalAmount: orderData[0].totalAmount,
            type: orderData[0].type,
            createdAt: orderData[0].createdAt,
            updatedAt: orderData[0].updatedAt,
            items: orderData[0].items,
        };
    }

    // Get featured restaurants
    async getFeaturedRestaurants(limit: number = 10) {
        const restaurants = await db
            .select()
            .from(restaurant)
            .where(eq(restaurant.isApproved, true))
            .limit(limit);

        return restaurants;
    }
}
