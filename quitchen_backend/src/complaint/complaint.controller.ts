import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
} from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto, UpdateComplaintDto } from './dto';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthenticatedUser } from '../auth/types';

@Controller('complaints')
export class ComplaintController {
    constructor(private readonly complaintService: ComplaintService) { }

    // Create complaint (public - no auth needed)
    @Public()
    @Post('restaurant/:restaurantId')
    async createComplaint(
        @Param('restaurantId') restaurantId: string,
        @Body() createComplaintDto: CreateComplaintDto,
    ) {
        return this.complaintService.createComplaint(restaurantId, createComplaintDto);
    }

    // Get restaurant complaints (owner only)
    @Get('restaurant/:restaurantId')
    async getRestaurantComplaints(
        @Param('restaurantId') restaurantId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.complaintService.getRestaurantComplaints(restaurantId, user);
    }

    // Get single complaint (public)
    @Public()
    @Get(':id')
    async getComplaintById(@Param('id') id: string) {
        return this.complaintService.getComplaintById(id);
    }

    // Update complaint (owner only)
    @Patch(':id')
    async updateComplaint(
        @Param('id') id: string,
        @Body() updateDto: UpdateComplaintDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.complaintService.updateComplaint(id, user, updateDto);
    }

    // Get complaint statistics (owner only)
    @Get('stats/restaurant/:restaurantId')
    async getComplaintStats(
        @Param('restaurantId') restaurantId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.complaintService.getComplaintStats(restaurantId, user);
    }
}
