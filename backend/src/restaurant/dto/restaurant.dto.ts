import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRestaurantDto {
    @ApiProperty({
        description: 'Name of the restaurant',
        example: 'Mario\'s Italian Bistro',
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    @Length(2, 100, { message: 'Restaurant name must be between 2 and 100 characters' })
    name: string;

    @ApiPropertyOptional({
        description: 'Description of the restaurant',
        example: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
        minLength: 10,
        maxLength: 500,
    })
    @IsString()
    @IsOptional()
    @Length(10, 500, { message: 'Description must be between 10 and 500 characters' })
    description?: string;

    @ApiProperty({
        description: 'Restaurant address',
        example: '123 Main Street, Downtown, City 12345',
        minLength: 10,
        maxLength: 200,
    })
    @IsString()
    @Length(10, 200, { message: 'Address must be between 10 and 200 characters' })
    address: string;

    @ApiPropertyOptional({
        description: 'Restaurant phone number',
        example: '+1 (555) 123-4567',
        minLength: 10,
        maxLength: 20,
    })
    @IsString()
    @IsOptional()
    @Length(10, 20, { message: 'Phone number must be between 10 and 20 characters' })
    phone?: string;

    @ApiPropertyOptional({
        description: 'Type of cuisine served',
        example: 'Italian',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @IsOptional()
    @Length(2, 50, { message: 'Cuisine type must be between 2 and 50 characters' })
    cuisine?: string;

    @ApiPropertyOptional({
        description: 'Profile image filename',
        example: 'restaurant-profile.jpg',
    })
    @IsString()
    @IsOptional()
    profileImage?: string;
}

export class UpdateRestaurantDto {
    @ApiPropertyOptional({
        description: 'Name of the restaurant',
        example: 'Mario\'s Italian Bistro',
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    @IsOptional()
    @Length(2, 100, { message: 'Restaurant name must be between 2 and 100 characters' })
    name?: string;

    @ApiPropertyOptional({
        description: 'Description of the restaurant',
        example: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
        minLength: 10,
        maxLength: 500,
    })
    @IsString()
    @IsOptional()
    @Length(10, 500, { message: 'Description must be between 10 and 500 characters' })
    description?: string;

    @ApiPropertyOptional({
        description: 'Restaurant address',
        example: '123 Main Street, Downtown, City 12345',
        minLength: 10,
        maxLength: 200,
    })
    @IsString()
    @IsOptional()
    @Length(10, 200, { message: 'Address must be between 10 and 200 characters' })
    address?: string;

    @ApiPropertyOptional({
        description: 'Restaurant phone number',
        example: '+1 (555) 123-4567',
        minLength: 10,
        maxLength: 20,
    })
    @IsString()
    @IsOptional()
    @Length(10, 20, { message: 'Phone number must be between 10 and 20 characters' })
    phone?: string;

    @ApiPropertyOptional({
        description: 'Type of cuisine served',
        example: 'Italian',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @IsOptional()
    @Length(2, 50, { message: 'Cuisine type must be between 2 and 50 characters' })
    cuisine?: string;

    @ApiPropertyOptional({
        description: 'Profile image filename',
        example: 'restaurant-profile.jpg',
    })
    @IsString()
    @IsOptional()
    profileImage?: string;
}
