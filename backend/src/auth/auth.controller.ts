import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterCustomerDto, RegisterRestaurantOwnerDto, LoginDto } from './dto/auth.dto';
import { CreateRestaurantDto } from '../restaurant/dto/restaurant.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register/customer')
    async registerCustomer(@Body(ValidationPipe) registerDto: RegisterCustomerDto) {
        return this.authService.registerCustomer(registerDto);
    }

    @Post('register/restaurant-owner')
    async registerRestaurantOwner(@Body(ValidationPipe) registerDto: RegisterRestaurantOwnerDto) {
        return this.authService.registerRestaurantOwner(registerDto);
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body(ValidationPipe) loginDto: LoginDto, @Request() req) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return this.authService.getProfile(req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Post('restaurant')
    async createRestaurant(
        @Body(ValidationPipe) createRestaurantDto: CreateRestaurantDto,
        @Request() req,
    ) {
        return this.authService.createRestaurant(req.user.id, createRestaurantDto);
    }
}
