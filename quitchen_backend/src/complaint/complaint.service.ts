import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../db/db';
import { complaint } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateComplaintDto, UpdateComplaintDto } from './dto';
import { AuthenticatedUser } from '../auth/types';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class ComplaintService {
    constructor(private readonly restaurantService: RestaurantService) { }

    // Create complaint (public - customers)
    async createComplaint(
        restaurantId: string,
        createComplaintDto: CreateComplaintDto,
    ) {
        // Verify restaurant exists
        await this.restaurantService.getRestaurantById(restaurantId);

        const newComplaint = await db.insert(complaint).values({
            restaurantId,
            ...createComplaintDto,
            status: 'open',
        }).returning();

        return newComplaint[0];
    }

    // Get complaints for a restaurant (owner only)
    async getRestaurantComplaints(restaurantId: string, owner: AuthenticatedUser) {
        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(restaurantId);

        if (restaurant.ownerId !== owner.id && owner.role !== 'platform_admin') {
            throw new BadRequestException('You do not have permission to view these complaints');
        }

        return await db
            .select()
            .from(complaint)
            .where(eq(complaint.restaurantId, restaurantId));
    }

    // Get single complaint
    async getComplaintById(complaintId: string) {
        const result = await db
            .select()
            .from(complaint)
            .where(eq(complaint.id, complaintId))
            .limit(1);

        if (result.length === 0) {
            throw new NotFoundException('Complaint not found');
        }

        return result[0];
    }

    // Update complaint (owner only)
    async updateComplaint(
        complaintId: string,
        owner: AuthenticatedUser,
        updateDto: UpdateComplaintDto,
    ) {
        const complaintData = await this.getComplaintById(complaintId);

        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(complaintData.restaurantId);

        if (restaurant.ownerId !== owner.id && owner.role !== 'platform_admin') {
            throw new BadRequestException('You do not have permission to update this complaint');
        }

        const updated = await db
            .update(complaint)
            .set(updateDto)
            .where(eq(complaint.id, complaintId))
            .returning();

        return updated[0];
    }

    // Get complaint statistics
    async getComplaintStats(restaurantId: string, owner: AuthenticatedUser) {
        // Verify ownership
        const restaurant = await this.restaurantService.getRestaurantById(restaurantId);

        if (restaurant.ownerId !== owner.id && owner.role !== 'platform_admin') {
            throw new BadRequestException('You do not have permission to view stats');
        }

        const complaints = await db
            .select()
            .from(complaint)
            .where(eq(complaint.restaurantId, restaurantId));

        const stats = {
            totalComplaints: complaints.length,
            openComplaints: complaints.filter(c => c.status === 'open').length,
            inProgressComplaints: complaints.filter(c => c.status === 'in_progress').length,
            resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
            highPriorityComplaints: complaints.filter(c => c.priority === 'high').length,
        };

        return stats;
    }
}
