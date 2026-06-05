import { IsString, IsOptional, IsNumber, IsPhoneNumber } from 'class-validator';

export class CreateRestaurantDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    cuisine?: string;

    @IsPhoneNumber('RW')
    phone: string;

    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;

    @IsOptional()
    @IsString()
    coverImage?: string;
}
