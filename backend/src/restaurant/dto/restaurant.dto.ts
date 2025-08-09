import { IsString, IsOptional, Length } from 'class-validator';

export class CreateRestaurantDto {
    @IsString()
    @Length(2, 100, { message: 'Restaurant name must be between 2 and 100 characters' })
    name: string;

    @IsString()
    @IsOptional()
    @Length(10, 500, { message: 'Description must be between 10 and 500 characters' })
    description?: string;

    @IsString()
    @Length(10, 200, { message: 'Address must be between 10 and 200 characters' })
    address: string;

    @IsString()
    @IsOptional()
    @Length(10, 20, { message: 'Phone number must be between 10 and 20 characters' })
    phone?: string;

    @IsString()
    @IsOptional()
    @Length(2, 50, { message: 'Cuisine type must be between 2 and 50 characters' })
    cuisine?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;
}

export class UpdateRestaurantDto {
    @IsString()
    @IsOptional()
    @Length(2, 100, { message: 'Restaurant name must be between 2 and 100 characters' })
    name?: string;

    @IsString()
    @IsOptional()
    @Length(10, 500, { message: 'Description must be between 10 and 500 characters' })
    description?: string;

    @IsString()
    @IsOptional()
    @Length(10, 200, { message: 'Address must be between 10 and 200 characters' })
    address?: string;

    @IsString()
    @IsOptional()
    @Length(10, 20, { message: 'Phone number must be between 10 and 20 characters' })
    phone?: string;

    @IsString()
    @IsOptional()
    @Length(2, 50, { message: 'Cuisine type must be between 2 and 50 characters' })
    cuisine?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;
}
