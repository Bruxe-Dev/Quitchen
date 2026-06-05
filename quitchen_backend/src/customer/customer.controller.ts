import { Controller, Get, Query, Param } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    // Search restaurants
    @Public()
    @Get('restaurants/search')
    async searchRestaurants(@Query('q') searchTerm: string) {
        if (!searchTerm || searchTerm.trim() === '') {
            return [];
        }
        return this.customerService.searchRestaurants(searchTerm);
    }

    // Get restaurants by city
    @Public()
    @Get('restaurants/city/:city')
    async getRestaurantsByCity(@Param('city') city: string) {
        return this.customerService.getRestaurantsByCity(city);
    }

    // Get featured restaurants
    @Public()
    @Get('restaurants/featured')
    async getFeaturedRestaurants(@Query('limit') limit: string = '10') {
        const numLimit = parseInt(limit) || 10;
        return this.customerService.getFeaturedRestaurants(numLimit);
    }

    // Get restaurant detail
    @Public()
    @Get('restaurants/:id')
    async getRestaurantDetail(@Param('id') restaurantId: string) {
        return this.customerService.getRestaurantDetail(restaurantId);
    }

    // Get restaurant reviews
    @Public()
    @Get('restaurants/:id/reviews')
    async getRestaurantReviews(@Param('id') restaurantId: string) {
        return this.customerService.getRestaurantReviews(restaurantId);
    }

    // Get my orders (by phone number)
    @Public()
    @Get('my-orders/:phone')
    async getMyOrders(@Param('phone') phone: string) {
        return this.customerService.getMyOrders(phone);
    }

    // Get my reservations (by phone number)
    @Public()
    @Get('my-reservations/:phone')
    async getMyReservations(@Param('phone') phone: string) {
        return this.customerService.getMyReservations(phone);
    }

    // Track order
    @Public()
    @Get('orders/:orderId/track')
    async trackOrder(@Param('orderId') orderId: string) {
        return this.customerService.trackOrder(orderId);
    }
}
