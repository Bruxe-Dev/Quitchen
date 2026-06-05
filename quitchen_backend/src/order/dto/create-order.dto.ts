import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsObject } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    customerName: string;

    @IsString()
    customerPhone: string;

    @IsOptional()
    @IsString()
    customerEmail?: string;

    @IsArray()
    items: Array<{ menuItemId: string; quantity: number }>;

    @IsEnum(['dine_in', 'takeaway'])
    type: 'dine_in' | 'takeaway';

    @IsOptional()
    @IsString()
    tableId?: string;

    @IsOptional()
    @IsString()
    specialRequests?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class UpdateOrderStatusDto {
    @IsEnum(['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'])
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
}
