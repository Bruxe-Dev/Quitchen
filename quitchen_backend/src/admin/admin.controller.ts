import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types';

@Controller('admin')
@Roles('platform_admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // Get all users
    @Get('users')
    async getAllUsers(@CurrentUser() admin: AuthenticatedUser) {
        return this.adminService.getAllUsers(admin);
    }

    // Get all restaurants
    @Get('restaurants')
    async getAllRestaurants(@CurrentUser() admin: AuthenticatedUser) {
        return this.adminService.getAllRestaurants(admin);
    }

    // Get pending restaurants
    @Get('restaurants/pending')
    async getPendingRestaurants(@CurrentUser() admin: AuthenticatedUser) {
        return this.adminService.getPendingRestaurants(admin);
    }

    // Approve restaurant
    @Post('restaurants/:restaurantId/approve')
    async approveRestaurant(
        @Param('restaurantId') restaurantId: string,
        @CurrentUser() admin: AuthenticatedUser,
    ) {
        return this.adminService.approveRestaurant(restaurantId, admin);
    }

    // Reject restaurant
    @Post('restaurants/:restaurantId/reject')
    async rejectRestaurant(
        @Param('restaurantId') restaurantId: string,
        @CurrentUser() admin: AuthenticatedUser,
    ) {
        return this.adminService.rejectRestaurant(restaurantId, admin);
    }

    // Deactivate restaurant
    @Post('restaurants/:restaurantId/deactivate')
    async deactivateRestaurant(
        @Param('restaurantId') restaurantId: string,
        @CurrentUser() admin: AuthenticatedUser,
    ) {
        return this.adminService.deactivateRestaurant(restaurantId, admin);
    }

    // Get platform statistics
    @Get('stats')
    async getPlatformStats(@CurrentUser() admin: AuthenticatedUser) {
        return this.adminService.getPlatformStats(admin);
    }
}
