import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMenuItemDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsNumber()
    preparationTime?: number; // in minutes
}
