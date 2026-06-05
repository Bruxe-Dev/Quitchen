import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../db/db';
import { order, orderItem, menuItem } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { AuthenticatedUser } from '../auth/types';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class OrderService {
    constructor(private readonly restaurantService: RestaurantService) { }

    // Create order (public - customers)
    async createOrder(
        restaurantId: string,
        createOrderDto: CreateOrderDto,
    ) {
        // Verify restaurant exists
        await this.restaurantService.getRestaurantById(restaurantId);

        let totalAmount = 0;
        const orderItemsData = [];

        // Calculate total and gather item details
        for (const item of createOrderDto.items) {
            const menuItemData = await db
                .select()
                .from(menuItem)
                .where(eq(menuItem.id, item.menuItemId))
                .limit(1);

            if (menuItemData.length === 0) {
                throw new BadRequestException(`Menu item ${item.menuItemId} not found`);
            }

            const menuItemPrice = menuItemData[0].price;
            const subtotal = menuItemPrice * item.quantity;
            totalAmount += subtotal;

            orderItemsData.push({
                menuItemId: item.menuItemId,
                name: menuItemData[0].name,
                price: menuItemPrice,
                quantity: item.quantity,
            });
        }

        // Create order
        const newOrder = await db.insert(order).values({
            restaurantId,
            customerName: createOrderDto.customerName,
            customerPhone: createOrderDto.customerPhone,
            customerEmail: createOrderDto.customerEmail,
            items: orderItemsData,
            totalAmount,
            type: createOrderDto.type,
            tableId: createOrderDto.tableId,
            specialRequests: createOrderDto.specialRequests,
            notes: createOrderDto.notes,
            currency: 'RWF',
            status: 'pending',
        }).returning();

        return newOrder[0];
    }

    // Get orders for a restaurant (owner only)
    async getRestaurantOrders(restaurantId: string, owner: AuthenticatedUser) {
        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(restaurantId);

        if (restaurant.ownerId !== owner.id && owner.role !== 'platform_admin') {
            throw new BadRequestException('You do not have permission to view these orders');
        }

        return await db
            .select()
            .from(order)
            .where(eq(order.restaurantId, restaurantId));
    }

    // Get single order
    async getOrderById(orderId: string) {
        const result = await db
            .select()
            .from(order)
            .where(eq(order.id, orderId))
            .limit(1);

        if (result.length === 0) {
            throw new NotFoundException('Order not found');
        }

        return result[0];
    }

    // Update order status (owner only)
    async updateOrderStatus(
        orderId: string,
        owner: AuthenticatedUser,
        updateDto: UpdateOrderStatusDto,
    ) {
        const orderData = await this.getOrderById(orderId);

        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(orderData.restaurantId);

        if (restaurant.ownerId !== owner.id && owner.role !== 'platform_admin') {
            throw new BadRequestException('You do not have permission to update this order');
        }

        const updated = await db
            .update(order)
            .set({ status: updateDto.status })
            .where(eq(order.id, orderId))
            .returning();

        return updated[0];
    }

    // Get order statistics
    async getOrderStats(restaurantId: string, owner: AuthenticatedUser) {
        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(restaurantId);

        if (restaurant.ownerId !== owner.id && owner.role !== 'platform_admin') {
            throw new BadRequestException('You do not have permission to view stats');
        }

        const orders = await db
            .select()
            .from(order)
            .where(eq(order.restaurantId, restaurantId));

        const stats = {
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            completedOrders: orders.filter(o => o.status === 'served').length,
            cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
            totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        };

        return stats;
    }
}
