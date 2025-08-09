import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
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
    ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { MealService } from './meal.service';
import { CreateMealDto, UpdateMealDto } from './dto/meal.dto';
import { MealFilterDto, PaginatedResponseDto } from './dto/pagination.dto';
import { FileUploadDto, UploadResponseDto } from '../restaurant/dto/upload.dto';
import { Multer } from 'multer';

@ApiTags('meals')
@Controller('meals')
export class MealController {
    constructor(private readonly mealService: MealService) { }

    @Get()
    @ApiOperation({ summary: 'Get all meals with pagination and filtering' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in meal name and description' })
    @ApiQuery({ name: 'restaurantId', required: false, type: Number, description: 'Filter by restaurant ID' })
    @ApiQuery({ name: 'isAvailable', required: false, type: Boolean, description: 'Filter by availability' })
    @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price filter' })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price filter' })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'price', 'createdAt', 'updatedAt'], description: 'Sort by field' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of meals retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            name: { type: 'string', example: 'Margherita Pizza' },
                            description: { type: 'string', example: 'Fresh tomatoes, mozzarella cheese, and basil' },
                            price: { type: 'number', example: 15.99 },
                            image: { type: 'string', example: 'meal-image.jpg' },
                            isAvailable: { type: 'boolean', example: true },
                            restaurant: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number', example: 1 },
                                    name: { type: 'string', example: 'Italian Bistro' },
                                    address: { type: 'string', example: '123 Main St' },
                                    cuisine: { type: 'string', example: 'Italian' },
                                    profileImage: { type: 'string', example: 'restaurant-image.jpg' },
                                    owner: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'number', example: 2 },
                                            firstName: { type: 'string', example: 'John' },
                                            lastName: { type: 'string', example: 'Doe' },
                                        },
                                    },
                                },
                            },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'number', example: 25 },
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 10 },
                        totalPages: { type: 'number', example: 3 },
                        hasNext: { type: 'boolean', example: true },
                        hasPrev: { type: 'boolean', example: false },
                    },
                },
            },
        },
    })
    async findAll(@Query(ValidationPipe) filters: MealFilterDto) {
        return this.mealService.findAllPaginated(filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get meal by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'Meal ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Meal details retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Margherita Pizza' },
                description: { type: 'string', example: 'Fresh tomatoes, mozzarella cheese, and basil' },
                price: { type: 'number', example: 15.99 },
                image: { type: 'string', example: 'meal-image.jpg' },
                isAvailable: { type: 'boolean', example: true },
                restaurant: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'Italian Bistro' },
                        address: { type: 'string', example: '123 Main St' },
                        cuisine: { type: 'string', example: 'Italian' },
                        profileImage: { type: 'string', example: 'restaurant-image.jpg' },
                        owner: {
                            type: 'object',
                            properties: {
                                id: { type: 'number', example: 2 },
                                firstName: { type: 'string', example: 'John' },
                                lastName: { type: 'string', example: 'Doe' },
                            },
                        },
                    },
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Meal not found' })
    async findOne(@Param('id') id: string) {
        return this.mealService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Get('my/meals')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get my restaurant meals with pagination and filtering (restaurant owners only)' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in meal name and description' })
    @ApiQuery({ name: 'isAvailable', required: false, type: Boolean, description: 'Filter by availability' })
    @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price filter' })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price filter' })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'price', 'createdAt', 'updatedAt'], description: 'Sort by field' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
    @ApiResponse({ status: 200, description: 'Paginated list of restaurant meals' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Restaurant owner role required' })
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
    async findMyMeals(@Request() req, @Query(ValidationPipe) filters: MealFilterDto) {
        return this.mealService.findByRestaurantOwner(req.user.id, filters);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Post()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new meal (restaurant owners only)' })
    @ApiResponse({ status: 201, description: 'Meal created successfully' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Restaurant owner role required' })
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
    async create(@Request() req, @Body(ValidationPipe) createMealDto: CreateMealDto) {
        return this.mealService.create(req.user.id, createMealDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Patch(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update a meal (restaurant owners only)' })
    @ApiParam({ name: 'id', type: 'number', description: 'Meal ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Meal updated successfully' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Restaurant owner role required' })
    @ApiResponse({ status: 404, description: 'Meal not found or access denied' })
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body(ValidationPipe) updateMealDto: UpdateMealDto,
    ) {
        return this.mealService.update(req.user.id, +id, updateMealDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete a meal (restaurant owners only)' })
    @ApiParam({ name: 'id', type: 'number', description: 'Meal ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Meal deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Restaurant owner role required' })
    @ApiResponse({ status: 404, description: 'Meal not found or access denied' })
    async remove(@Request() req, @Param('id') id: string) {
        return this.mealService.delete(req.user.id, +id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Post(':id/upload-image')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload meal image (restaurant owners only)' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', type: 'number', description: 'Meal ID', example: 1 })
    @ApiBody({
        description: 'Upload meal image file',
        type: FileUploadDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Meal image uploaded successfully',
        type: UploadResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid file type or file too large' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Restaurant owner role required' })
    @ApiResponse({ status: 404, description: 'Meal not found or access denied' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadMealImage(
        @Request() req,
        @Param('id') id: string,
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
        return this.mealService.uploadMealImage(req.user.id, +id, file);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Delete(':id/image')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete meal image (restaurant owners only)' })
    @ApiParam({ name: 'id', type: 'number', description: 'Meal ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Meal image deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Restaurant owner role required' })
    @ApiResponse({ status: 404, description: 'Meal not found or access denied' })
    async deleteMealImage(@Request() req, @Param('id') id: string) {
        return this.mealService.deleteMealImage(req.user.id, +id);
    }
}
