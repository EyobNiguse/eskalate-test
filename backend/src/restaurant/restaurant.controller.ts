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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurant.dto';

@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Get()
    async findAll() {
        return this.restaurantService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.restaurantService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Get('my/restaurant')
    async getMyRestaurant(@Request() req) {
        return this.restaurantService.findByOwnerId(req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Patch('my/restaurant')
    async updateMyRestaurant(@Request() req, @Body(ValidationPipe) updateData: UpdateRestaurantDto) {
        return this.restaurantService.updateByOwnerId(req.user.id, updateData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Delete('my/restaurant')
    async deleteMyRestaurant(@Request() req) {
        return this.restaurantService.deleteByOwnerId(req.user.id);
    }
}
