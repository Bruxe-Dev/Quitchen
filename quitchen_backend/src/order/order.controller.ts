import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthenticatedUser } from '../auth/types';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    // Create order (public - no auth needed)
    @Public()
    @Post('restaurant/:restaurantId')
    async createOrder(
        @Param('restaurantId') restaurantId: string,
        @Body() createOrderDto: CreateOrderDto,
    ) {
        return this.orderService.createOrder(restaurantId, createOrderDto);
    }

    // Get restaurant orders (owner only)
    @Get('restaurant/:restaurantId')
    async getRestaurantOrders(
        @Param('restaurantId') restaurantId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.orderService.getRestaurantOrders(restaurantId, user);
    }

    // Get single order (public)
    @Public()
    @Get(':id')
    async getOrderById(@Param('id') id: string) {
        return this.orderService.getOrderById(id);
    }

    // Update order status (owner only)
    @Patch(':id/status')
    async updateOrderStatus(
        @Param('id') id: string,
        @Body() updateDto: UpdateOrderStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.orderService.updateOrderStatus(id, user, updateDto);
    }

    // Get order statistics (owner only)
    @Get('stats/restaurant/:restaurantId')
    async getOrderStats(
        @Param('restaurantId') restaurantId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.orderService.getOrderStats(restaurantId, user);
    }
}
