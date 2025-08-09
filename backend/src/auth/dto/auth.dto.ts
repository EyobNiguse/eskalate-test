import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber, Length } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}

export class RegisterCustomerDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
    firstName: string;

    @IsString()
    @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
    lastName: string;
}

export class RegisterRestaurantOwnerDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
    firstName: string;

    @IsString()
    @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
    lastName: string;

    // Restaurant details
    @IsString()
    @Length(2, 100, { message: 'Restaurant name must be between 2 and 100 characters' })
    restaurantName: string;

    @IsString()
    @IsOptional()
    @Length(10, 500, { message: 'Description must be between 10 and 500 characters' })
    restaurantDescription?: string;

    @IsString()
    @Length(10, 200, { message: 'Address must be between 10 and 200 characters' })
    restaurantAddress: string;

    @IsString()
    @IsOptional()
    @Length(10, 20, { message: 'Phone number must be between 10 and 20 characters' })
    restaurantPhone?: string;

    @IsString()
    @IsOptional()
    @Length(2, 50, { message: 'Cuisine type must be between 2 and 50 characters' })
    restaurantCuisine?: string;
}
