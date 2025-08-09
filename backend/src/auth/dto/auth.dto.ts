import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
        format: 'email',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123',
        minLength: 6,
    })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}

export class RegisterCustomerDto {
    @ApiProperty({
        description: 'Customer email address',
        example: 'customer@example.com',
        format: 'email',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({
        description: 'Customer password',
        example: 'password123',
        minLength: 6,
    })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({
        description: 'Customer first name',
        example: 'John',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
    firstName: string;

    @ApiProperty({
        description: 'Customer last name',
        example: 'Doe',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
    lastName: string;
}

export class RegisterRestaurantOwnerDto {
    @ApiProperty({
        description: 'Restaurant owner email address',
        example: 'owner@restaurant.com',
        format: 'email',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({
        description: 'Restaurant owner password',
        example: 'password123',
        minLength: 6,
    })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({
        description: 'Restaurant owner first name',
        example: 'Mario',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
    firstName: string;

    @ApiProperty({
        description: 'Restaurant owner last name',
        example: 'Rossi',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
    lastName: string;

    @ApiProperty({
        description: 'Name of the restaurant',
        example: 'Mario\'s Italian Bistro',
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    @Length(2, 100, { message: 'Restaurant name must be between 2 and 100 characters' })
    restaurantName: string;

    @ApiProperty({
        description: 'Description of the restaurant',
        example: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
        minLength: 10,
        maxLength: 500,
        required: false,
    })
    @IsString()
    @IsOptional()
    @Length(10, 500, { message: 'Description must be between 10 and 500 characters' })
    restaurantDescription?: string;

    @ApiProperty({
        description: 'Restaurant address',
        example: '123 Main Street, Downtown, City 12345',
        minLength: 10,
        maxLength: 200,
    })
    @IsString()
    @Length(10, 200, { message: 'Address must be between 10 and 200 characters' })
    restaurantAddress: string;

    @ApiProperty({
        description: 'Restaurant phone number',
        example: '+1 (555) 123-4567',
        minLength: 10,
        maxLength: 20,
        required: false,
    })
    @IsString()
    @IsOptional()
    @Length(10, 20, { message: 'Phone number must be between 10 and 20 characters' })
    restaurantPhone?: string;

    @ApiProperty({
        description: 'Type of cuisine served',
        example: 'Italian',
        minLength: 2,
        maxLength: 50,
        required: false,
    })
    @IsString()
    @IsOptional()
    @Length(2, 50, { message: 'Cuisine type must be between 2 and 50 characters' })
    restaurantCuisine?: string;
}
