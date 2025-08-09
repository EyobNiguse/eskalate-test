import { IsOptional, IsNumber, IsString, IsBoolean, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
    @ApiPropertyOptional({
        description: 'Page number (starts from 1)',
        example: 1,
        minimum: 1,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Page must be a number' })
    @Min(1, { message: 'Page must be at least 1' })
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100,
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Limit must be a number' })
    @Min(1, { message: 'Limit must be at least 1' })
    @Max(100, { message: 'Limit cannot exceed 100' })
    limit?: number = 10;
}

export class MealFilterDto extends PaginationDto {
    @ApiPropertyOptional({
        description: 'Search in meal name and description',
        example: 'pizza',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Filter by restaurant ID',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Restaurant ID must be a number' })
    restaurantId?: number;

    @ApiPropertyOptional({
        description: 'Filter by availability',
        example: true,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean({ message: 'isAvailable must be a boolean' })
    isAvailable?: boolean;

    @ApiPropertyOptional({
        description: 'Minimum price filter',
        example: 10.00,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Min price must be a number' })
    @Min(0, { message: 'Min price must be at least 0' })
    minPrice?: number;

    @ApiPropertyOptional({
        description: 'Maximum price filter',
        example: 50.00,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Max price must be a number' })
    @Min(0, { message: 'Max price must be at least 0' })
    maxPrice?: number;

    @ApiPropertyOptional({
        description: 'Sort by field',
        example: 'price',
        enum: ['name', 'price', 'createdAt', 'updatedAt'],
    })
    @IsOptional()
    @IsString()
    sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';

    @ApiPropertyOptional({
        description: 'Sort order',
        example: 'ASC',
        enum: ['ASC', 'DESC'],
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'ASC' | 'DESC';
}

export class PaginatedResponseDto<T> {
    @ApiPropertyOptional({
        description: 'Array of items for current page',
    })
    data: T[];

    @ApiPropertyOptional({
        description: 'Pagination metadata',
        example: {
            total: 25,
            page: 1,
            limit: 10,
            totalPages: 3,
            hasNext: true,
            hasPrev: false,
        },
    })
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
