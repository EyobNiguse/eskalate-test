import { ApiProperty } from '@nestjs/swagger';

export class MealResponseDto {
    @ApiProperty({
        description: 'Meal ID',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Meal name',
        example: 'Margherita Pizza',
    })
    name: string;

    @ApiProperty({
        description: 'Meal description',
        example: 'Fresh tomatoes, mozzarella cheese, and basil on a crispy crust',
    })
    description: string;

    @ApiProperty({
        description: 'Meal price in dollars',
        example: 15.99,
    })
    price: number;

    @ApiProperty({
        description: 'Meal image filename',
        example: 'meal-image.jpg',
        nullable: true,
    })
    image: string | null;

    @ApiProperty({
        description: 'Whether the meal is available for order',
        example: true,
    })
    isAvailable: boolean;

    @ApiProperty({
        description: 'Restaurant ID',
        example: 1,
    })
    restaurantId: number;

    @ApiProperty({
        description: 'Restaurant information',
        type: 'object',
        properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Italian Bistro' },
            address: { type: 'string', example: '123 Main St' },
            cuisine: { type: 'string', example: 'Italian' },
            profileImage: { type: 'string', example: 'restaurant-image.jpg', nullable: true },
            owner: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 2 },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                },
            },
        },
    })
    restaurant: {
        id: number;
        name: string;
        address: string;
        cuisine: string;
        profileImage: string | null;
        owner: {
            id: number;
            firstName: string;
            lastName: string;
        };
    };

    @ApiProperty({
        description: 'Meal creation date',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Meal last update date',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt: Date;
}

export class PaginatedMealsResponseDto {
    @ApiProperty({
        description: 'Array of meals for current page',
        type: [MealResponseDto],
    })
    data: MealResponseDto[];

    @ApiProperty({
        description: 'Pagination metadata',
        type: 'object',
        properties: {
            total: { type: 'number', example: 25 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 3 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false },
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
