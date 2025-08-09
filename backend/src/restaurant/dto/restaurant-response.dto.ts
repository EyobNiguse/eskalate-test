import { ApiProperty } from '@nestjs/swagger';

export class RestaurantResponseDto {
    @ApiProperty({
        description: 'Restaurant ID',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Restaurant name',
        example: 'Mario\'s Italian Bistro',
    })
    name: string;

    @ApiProperty({
        description: 'Restaurant description',
        example: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
        nullable: true,
    })
    description: string | null;

    @ApiProperty({
        description: 'Restaurant address',
        example: '123 Main Street, Downtown, City 12345',
    })
    address: string;

    @ApiProperty({
        description: 'Restaurant phone number',
        example: '+1 (555) 123-4567',
        nullable: true,
    })
    phone: string | null;

    @ApiProperty({
        description: 'Type of cuisine served',
        example: 'Italian',
        nullable: true,
    })
    cuisine: string | null;

    @ApiProperty({
        description: 'Restaurant profile image filename',
        example: 'restaurant-profile.jpg',
        nullable: true,
    })
    profileImage: string | null;

    @ApiProperty({
        description: 'Restaurant owner information',
        type: 'object',
        properties: {
            id: { type: 'number', example: 2 },
            firstName: { type: 'string', example: 'Mario' },
            lastName: { type: 'string', example: 'Rossi' },
            email: { type: 'string', example: 'mario@restaurant.com' },
        },
    })
    owner: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };

    @ApiProperty({
        description: 'Restaurant creation date',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Restaurant last update date',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt: Date;
}

export class RestaurantListResponseDto {
    @ApiProperty({
        description: 'Restaurant ID',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Restaurant name',
        example: 'Mario\'s Italian Bistro',
    })
    name: string;

    @ApiProperty({
        description: 'Restaurant description',
        example: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
        nullable: true,
    })
    description: string | null;

    @ApiProperty({
        description: 'Restaurant address',
        example: '123 Main Street, Downtown, City 12345',
    })
    address: string;

    @ApiProperty({
        description: 'Type of cuisine served',
        example: 'Italian',
        nullable: true,
    })
    cuisine: string | null;

    @ApiProperty({
        description: 'Restaurant profile image filename',
        example: 'restaurant-profile.jpg',
        nullable: true,
    })
    profileImage: string | null;

    @ApiProperty({
        description: 'Restaurant creation date',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date;
}
