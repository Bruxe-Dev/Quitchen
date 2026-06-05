import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types';

@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) { }

    // Create restaurant (owner only)
    @Post()
    async createRestaurant(
        @Body() createRestaurantDto: CreateRestaurantDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.restaurantService.createRestaurant(user, createRestaurantDto);
    }

    // Get all approved restaurants (public)
    @Public()
    @Get()
    async getAllRestaurants() {
        return this.restaurantService.getAllRestaurants(true);
    }

    // Get single restaurant (public)
    @Public()
    @Get(':id')
    async getRestaurantById(@Param('id') id: string) {
        return this.restaurantService.getRestaurantById(id);
    }

    // Get my restaurant (owner only)
    @Get('my/restaurant')
    async getMyRestaurant(@CurrentUser() user: AuthenticatedUser) {
        return this.restaurantService.getMyRestaurant(user);
    }

    // Update restaurant (owner only)
    @Put(':id')
    async updateRestaurant(
        @Param('id') id: string,
        @Body() updateRestaurantDto: UpdateRestaurantDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.restaurantService.updateRestaurant(id, user, updateRestaurantDto);
    }

    // Get restaurant tables (public)
    @Public()
    @Get(':id/tables')
    async getRestaurantTables(@Param('id') restaurantId: string) {
        return this.restaurantService.getRestaurantTables(restaurantId);
    }

    // Create table (owner only)
    @Post(':id/tables')
    async createTable(
        @Param('id') restaurantId: string,
        @Body() tableData: { tableNumber: string; seats: number },
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.restaurantService.createTable(restaurantId, user, tableData);
    }

    // Delete table (owner only)
    @Delete('tables/:tableId')
    async deleteTable(
        @Param('tableId') tableId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.restaurantService.deleteTable(tableId, user);
    }
}
