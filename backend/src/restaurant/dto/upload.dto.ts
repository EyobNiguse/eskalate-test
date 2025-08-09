import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Image file to upload (JPEG, PNG, WebP)',
        example: 'restaurant-image.jpg',
    })
    file: any;
}

export class UploadResponseDto {
    @ApiProperty({
        description: 'Success message',
        example: 'Restaurant image uploaded successfully',
    })
    message: string;

    @ApiProperty({
        description: 'URL to access the uploaded image',
        example: '/uploads/unique-filename.jpg',
    })
    imageUrl: string;

    @ApiProperty({
        description: 'Generated filename for the uploaded image',
        example: 'unique-filename.jpg',
    })
    fileName: string;
}
