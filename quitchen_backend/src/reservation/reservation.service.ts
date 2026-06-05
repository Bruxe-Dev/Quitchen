import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../db/db';
import { reservation } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { AuthenticatedUser } from '../auth/types';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class ReservationService {
    constructor(private readonly restaurantService: RestaurantService) { }

    // Create reservation (public - customers)
    async createReservation(
        restaurantId: string,
        createReservationDto: CreateReservationDto,
    ) {
        // Verify restaurant exists
        await this.restaurantService.getRestaurantById(restaurantId);

        // Verify table exists and belongs to restaurant
        const tables = await this.restaurantService.getRestaurantTables(restaurantId);
        const table = tables.find(t => t.id === createReservationDto.tableId);

        if (!table) {
            throw new BadRequestException('Table not found in this restaurant');
        }

        // Check for conflicting reservations
        const conflictingReservations = await db
            .select()
            .from(reservation)
            .where(eq(reservation.tableId, createReservationDto.tableId));

        // Simple conflict check - in production, use more sophisticated time logic
        const newReservation = await db.insert(reservation).values({
            restaurantId,
            tableId: createReservationDto.tableId,
            customerName: createReservationDto.customerName,
            customerPhone: createReservationDto.customerPhone,
            customerEmail: createReservationDto.customerEmail,
            reservationDate: new Date(createReservationDto.reservationDate + ' ' + createReservationDto.reservationTime),
            numberOfGuests: createReservationDto.numberOfGuests,
            specialRequests: createReservationDto.specialRequests,
            status: 'confirmed',
        }).returning();

        return newReservation[0];
    }

    // Get reservations for a restaurant (owner only)
    async getRestaurantReservations(restaurantId: string, owner: AuthenticatedUser) {
        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(restaurantId);

        if (restaurant.ownerId !== owner.id && owner.role !== 'platform_admin') {
            throw new BadRequestException('You do not have permission to view these reservations');
        }

        return await db
            .select()
            .from(reservation)
            .where(eq(reservation.restaurantId, restaurantId));
    }

    // Get single reservation
    async getReservationById(reservationId: string) {
        const result = await db
            .select()
            .from(reservation)
            .where(eq(reservation.id, reservationId))
            .limit(1);

        if (result.length === 0) {
            throw new NotFoundException('Reservation not found');
        }

        return result[0];
    }

    // Update reservation (owner only)
    async updateReservation(
        reservationId: string,
        owner: AuthenticatedUser,
        updateDto: UpdateReservationDto,
    ) {
        const reservationData = await this.getReservationById(reservationId);

        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(reservationData.restaurantId);

        if (restaurant.ownerId !== owner.id && owner.role !== 'platform_admin') {
            throw new BadRequestException('You do not have permission to update this reservation');
        }

        const updated = await db
            .update(reservation)
            .set(updateDto)
            .where(eq(reservation.id, reservationId))
            .returning();

        return updated[0];
    }

    // Cancel reservation
    async cancelReservation(reservationId: string, owner: AuthenticatedUser) {
        const reservationData = await this.getReservationById(reservationId);

        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(reservationData.restaurantId);

        if (restaurant.ownerId !== owner.id && owner.role !== 'platform_admin') {
            throw new BadRequestException('You do not have permission to cancel this reservation');
        }

        const updated = await db
            .update(reservation)
            .set({ status: 'cancelled' })
            .where(eq(reservation.id, reservationId))
            .returning();

        return updated[0];
    }
}
