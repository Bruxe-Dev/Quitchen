import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthenticatedUser } from '../auth/types';

@Controller('reservations')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) { }

    // Create reservation (public - no auth needed)
    @Public()
    @Post('restaurant/:restaurantId')
    async createReservation(
        @Param('restaurantId') restaurantId: string,
        @Body() createReservationDto: CreateReservationDto,
    ) {
        return this.reservationService.createReservation(restaurantId, createReservationDto);
    }

    // Get restaurant reservations (owner only)
    @Get('restaurant/:restaurantId')
    async getRestaurantReservations(
        @Param('restaurantId') restaurantId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.reservationService.getRestaurantReservations(restaurantId, user);
    }

    // Get single reservation (public)
    @Public()
    @Get(':id')
    async getReservationById(@Param('id') id: string) {
        return this.reservationService.getReservationById(id);
    }

    // Update reservation (owner only)
    @Patch(':id')
    async updateReservation(
        @Param('id') id: string,
        @Body() updateDto: UpdateReservationDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.reservationService.updateReservation(id, user, updateDto);
    }

    // Cancel reservation (owner only)
    @Patch(':id/cancel')
    async cancelReservation(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.reservationService.cancelReservation(id, user);
    }
}
