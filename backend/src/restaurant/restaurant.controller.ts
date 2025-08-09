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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurant.dto';
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
    @ApiResponse({ status: 200, description: 'List of all restaurants' })
    async findAll() {
        return this.restaurantService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get restaurant by ID' })
    @ApiResponse({ status: 200, description: 'Restaurant details' })
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
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
        description: 'Restaurant profile image',
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Invalid file or file too large' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
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
