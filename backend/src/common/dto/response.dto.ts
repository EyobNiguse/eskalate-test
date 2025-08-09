import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
    @ApiProperty({
        description: 'Response message',
        example: 'Operation completed successfully',
    })
    message: string;
}

export class LoginResponseDto {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'User information',
        type: 'object',
        properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            role: { type: 'string', example: 'CUSTOMER', enum: ['CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN'] },
        },
    })
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

export class UserProfileResponseDto {
    @ApiProperty({
        description: 'User ID',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'User email',
        example: 'user@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'User first name',
        example: 'John',
    })
    firstName: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
    })
    lastName: string;

    @ApiProperty({
        description: 'User role',
        example: 'CUSTOMER',
        enum: ['CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN'],
    })
    role: string;

    @ApiProperty({
        description: 'Account creation date',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Account last update date',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt: Date;
}

export class ErrorResponseDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 400,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Error message or array of validation errors',
        oneOf: [
            { type: 'string', example: 'Bad Request' },
            { type: 'array', items: { type: 'string' }, example: ['email must be a valid email', 'password must be at least 6 characters'] },
        ],
    })
    message: string | string[];

    @ApiProperty({
        description: 'Error type',
        example: 'Bad Request',
    })
    error: string;
}
