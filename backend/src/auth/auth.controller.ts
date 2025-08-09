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
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterCustomerDto, RegisterRestaurantOwnerDto, LoginDto } from './dto/auth.dto';
import { LoginResponseDto, UserProfileResponseDto, MessageResponseDto, ErrorResponseDto } from '../common/dto/response.dto';
import { CreateRestaurantDto } from '../restaurant/dto/restaurant.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register/customer')
    @ApiOperation({ summary: 'Register as a customer' })
    @ApiResponse({ status: 201, description: 'Customer registered successfully', type: LoginResponseDto })
    @ApiResponse({ status: 400, description: 'Validation error', type: ErrorResponseDto })
    @ApiResponse({ status: 409, description: 'Email already exists', type: ErrorResponseDto })
    async registerCustomer(@Body(ValidationPipe) registerDto: RegisterCustomerDto) {
        return this.authService.registerCustomer(registerDto);
    }

    @Post('register/restaurant-owner')
    @ApiOperation({ summary: 'Register as a restaurant owner (creates restaurant automatically)' })
    @ApiResponse({ status: 201, description: 'Restaurant owner registered successfully', type: LoginResponseDto })
    @ApiResponse({ status: 400, description: 'Validation error', type: ErrorResponseDto })
    @ApiResponse({ status: 409, description: 'Email already exists', type: ErrorResponseDto })
    async registerRestaurantOwner(@Body(ValidationPipe) registerDto: RegisterRestaurantOwnerDto) {
        return this.authService.registerRestaurantOwner(registerDto);
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials', type: ErrorResponseDto })
    async login(@Body(ValidationPipe) loginDto: LoginDto, @Request() req) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: UserProfileResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
    async getProfile(@Request() req) {
        return this.authService.getProfile(req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.RESTAURANT_OWNER)
    @Post('restaurant')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a restaurant (restaurant owners only)' })
    @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'Restaurant already exists' })
    async createRestaurant(
        @Body(ValidationPipe) createRestaurantDto: CreateRestaurantDto,
        @Request() req,
    ) {
        return this.authService.createRestaurant(req.user.id, createRestaurantDto);
    }
}
