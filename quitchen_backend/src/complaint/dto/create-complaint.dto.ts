import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateComplaintDto {
    @IsString()
    customerName: string;

    @IsString()
    customerEmail: string;

    @IsString()
    subject: string;

    @IsString()
    description: string;

    @IsEnum(['low', 'medium', 'high'])
    priority: 'low' | 'medium' | 'high';

    @IsOptional()
    @IsString()
    orderId?: string;
}

export class UpdateComplaintDto {
    @IsOptional()
    @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
    status?: 'open' | 'in_progress' | 'resolved' | 'closed';

    @IsOptional()
    @IsString()
    response?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
