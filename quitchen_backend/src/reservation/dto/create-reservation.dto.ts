import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateReservationDto {
    @IsString()
    customerName: string;

    @IsString()
    customerPhone: string;

    @IsOptional()
    @IsString()
    customerEmail?: string;

    @IsDateString()
    reservationDate: string;

    @IsString()
    reservationTime: string;

    @IsNumber()
    numberOfGuests: number;

    @IsString()
    tableId: string;

    @IsOptional()
    @IsString()
    specialRequests?: string;
}

export class UpdateReservationDto {
    @IsOptional()
    @IsString()
    status?: 'confirmed' | 'arrived' | 'cancelled' | 'completed';

    @IsOptional()
    @IsString()
    notes?: string;
}
