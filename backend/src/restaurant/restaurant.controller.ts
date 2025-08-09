import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    ValidationPipe,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiConsumes,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurant.dto';
import { FileUploadDto, UploadResponseDto } from './dto/upload.dto';
import { UploadService } from '../upload/upload.service';
import { Multer } from 'multer';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService,
        private readonly uploadService: UploadService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all restaurants' })
    @ApiResponse({
        status: 200,
        description: 'List of all restaurants retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Delicious Bites' },
                    description: { type: 'string', example: 'The best Italian food in town' },
                    address: { type: 'string', example: '123 Main Street, City, State 12345' },
                    phone: { type: 'string', example: '+1-555-0123' },
                    cuisine: { type: 'string', example: 'Italian' },
                    profileImage: { type: 'string', example: 'unique-filename.jpg' },
                    owner: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 2 },
                            firstName: { type: 'string', example: 'Jane' },
                            lastName: { type: 'string', example: 'Smith' },
                            email: { type: 'string', example: 'owner@example.com' },
                        },
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
        },
    })
    async findAll() {
        return this.restaurantService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get restaurant by ID' })
    @ApiParam({
        name: 'id',
        type: 'number',
        description: 'Restaurant ID',
        example: 1
    })
    @ApiResponse({
        status: 200,
        description: 'Restaurant details retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Delicious Bites' },
                description: { type: 'string', example: 'The best Italian food in town' },
                address: { type: 'string', example: '123 Main Street, City, State 12345' },
                phone: { type: 'string', example: '+1-555-0123' },
                cuisine: { type: 'string', example: 'Italian' },
                profileImage: { type: 'string', example: 'unique-filename.jpg' },
                owner: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 2 },
                        firstName: { type: 'string', example: 'Jane' },
                        lastName: { type: 'string', example: 'Smith' },
                        email: { type: 'string', example: 'owner@example.com' },
                    },
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
    @ApiResponse({ status: 400, description: 'Invalid restaurant ID format' })
    async findOne(@Param('id') id: string) {
        return this.restaurantService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Get('my/restaurant')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get my restaurant (restaurant owners only)' })
    @ApiResponse({ status: 200, description: 'Restaurant details' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
    async getMyRestaurant(@Request() req) {
        return this.restaurantService.findByOwnerId(req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Patch('my/restaurant')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update my restaurant (restaurant owners only)' })
    @ApiResponse({ status: 200, description: 'Restaurant updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
    async updateMyRestaurant(@Request() req, @Body(ValidationPipe) updateData: UpdateRestaurantDto) {
        return this.restaurantService.updateByOwnerId(req.user.id, updateData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Post('my/restaurant/upload-image')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload restaurant profile image (restaurant owners only)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload restaurant profile image file',
        type: FileUploadDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Image uploaded successfully',
        type: UploadResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid file type or file too large' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Restaurant owner role required' })
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadRestaurantImage(
        @Request() req,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
                ],
            }),
        )
        file: Multer.File,
    ) {
        return this.restaurantService.uploadRestaurantImage(req.user.id, file);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Delete('my/restaurant/image')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete restaurant profile image (restaurant owners only)' })
    @ApiResponse({ status: 200, description: 'Image deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
    async deleteRestaurantImage(@Request() req) {
        return this.restaurantService.deleteRestaurantImage(req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Delete('my/restaurant')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete my restaurant (restaurant owners only)' })
    @ApiResponse({ status: 200, description: 'Restaurant deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
    async deleteMyRestaurant(@Request() req) {
        return this.restaurantService.deleteByOwnerId(req.user.id);
    }
}
