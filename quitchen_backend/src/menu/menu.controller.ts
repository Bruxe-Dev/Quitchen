import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Body,
    Param,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthenticatedUser } from '../auth/types';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    // Get all menu items for a restaurant (public)
    @Public()
    @Get('restaurant/:restaurantId')
    async getMenuItems(@Param('restaurantId') restaurantId: string) {
        return this.menuService.getMenuItems(restaurantId);
    }

    // Get single menu item (public)
    @Public()
    @Get(':id')
    async getMenuItemById(@Param('id') id: string) {
        return this.menuService.getMenuItemById(id);
    }

    // Create menu item (owner only)
    @Post('restaurant/:restaurantId')
    async createMenuItem(
        @Param('restaurantId') restaurantId: string,
        @Body() createMenuItemDto: CreateMenuItemDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.menuService.createMenuItem(restaurantId, user, createMenuItemDto);
    }

    // Update menu item (owner only)
    @Put(':id')
    async updateMenuItem(
        @Param('id') id: string,
        @Body() updateMenuItemDto: UpdateMenuItemDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.menuService.updateMenuItem(id, user, updateMenuItemDto);
    }

    // Delete menu item (owner only)
    @Delete(':id')
    async deleteMenuItem(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.menuService.deleteMenuItem(id, user);
    }

    // Toggle availability (owner only)
    @Patch(':id/toggle-availability')
    async toggleAvailability(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.menuService.toggleAvailability(id, user);
    }
}
