import { IsString, IsNumber, IsOptional, IsBoolean, Length, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMealDto {
    @ApiProperty({
        description: 'Name of the meal',
        example: 'Margherita Pizza',
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    @Length(2, 100, { message: 'Meal name must be between 2 and 100 characters' })
    name: string;

    @ApiProperty({
        description: 'Description of the meal',
        example: 'Fresh tomatoes, mozzarella cheese, and basil on a crispy crust',
        minLength: 10,
        maxLength: 500,
    })
    @IsString()
    @Length(10, 500, { message: 'Description must be between 10 and 500 characters' })
    description: string;

    @ApiProperty({
        description: 'Price of the meal in dollars',
        example: 15.99,
        minimum: 0.01,
        maximum: 999.99,
    })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number with up to 2 decimal places' })
    @Min(0.01, { message: 'Price must be at least $0.01' })
    @Max(999.99, { message: 'Price cannot exceed $999.99' })
    @Type(() => Number)
    price: number;

    @ApiPropertyOptional({
        description: 'Whether the meal is available for order',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isAvailable?: boolean;
}

export class UpdateMealDto {
    @ApiPropertyOptional({
        description: 'Name of the meal',
        example: 'Margherita Pizza',
        minLength: 2,
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @Length(2, 100, { message: 'Meal name must be between 2 and 100 characters' })
    name?: string;

    @ApiPropertyOptional({
        description: 'Description of the meal',
        example: 'Fresh tomatoes, mozzarella cheese, and basil on a crispy crust',
        minLength: 10,
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @Length(10, 500, { message: 'Description must be between 10 and 500 characters' })
    description?: string;

    @ApiPropertyOptional({
        description: 'Price of the meal in dollars',
        example: 15.99,
        minimum: 0.01,
        maximum: 999.99,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number with up to 2 decimal places' })
    @Min(0.01, { message: 'Price must be at least $0.01' })
    @Max(999.99, { message: 'Price cannot exceed $999.99' })
    @Type(() => Number)
    price?: number;

    @ApiPropertyOptional({
        description: 'Whether the meal is available for order',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isAvailable?: boolean;

    @ApiPropertyOptional({
        description: 'Image filename for the meal',
        example: 'meal-image.jpg',
    })
    @IsOptional()
    @IsString()
    image?: string;
}
