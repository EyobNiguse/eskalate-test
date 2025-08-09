import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { RegisterCustomerDto, RegisterRestaurantOwnerDto, LoginDto } from './dto/auth.dto';
import { CreateRestaurantDto, UpdateRestaurantDto } from '../restaurant/dto/restaurant.dto';
import { UserWithRestaurant } from '../types/entities';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<UserWithRestaurant | null> {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['restaurant'],
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                restaurant: user.restaurant,
            },
        };
    }

    async registerCustomer(registerDto: RegisterCustomerDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = this.userRepository.create({
            email: registerDto.email,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            role: UserRole.CUSTOMER,
        });

        const savedUser = await this.userRepository.save(user);

        const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: savedUser.id,
                email: savedUser.email,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                role: savedUser.role,
            },
        };
    }

    async registerRestaurantOwner(registerDto: RegisterRestaurantOwnerDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Create user first
        const user = this.userRepository.create({
            email: registerDto.email,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            role: UserRole.RESTAURANT_OWNER,
        });

        const savedUser = await this.userRepository.save(user);

        // Create restaurant
        const restaurant = this.restaurantRepository.create({
            name: registerDto.restaurantName,
            description: registerDto.restaurantDescription,
            address: registerDto.restaurantAddress,
            phone: registerDto.restaurantPhone,
            cuisine: registerDto.restaurantCuisine,
            owner: savedUser,
        });

        const savedRestaurant = await this.restaurantRepository.save(restaurant);

        // Update user with restaurant reference
        savedUser.restaurant = savedRestaurant;
        await this.userRepository.save(savedUser);

        const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: savedUser.id,
                email: savedUser.email,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                role: savedUser.role,
                restaurant: {
                    id: savedRestaurant.id,
                    name: savedRestaurant.name,
                    description: savedRestaurant.description,
                    address: savedRestaurant.address,
                    phone: savedRestaurant.phone,
                    cuisine: savedRestaurant.cuisine,
                },
            },
        };
    }

    async createRestaurant(userId: number, createRestaurantDto: CreateRestaurantDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['restaurant'],
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (user.role !== UserRole.RESTAURANT_OWNER) {
            throw new UnauthorizedException('Only restaurant owners can create restaurants');
        }

        if (user.restaurant) {
            throw new ConflictException('User already has a restaurant');
        }

        const restaurant = this.restaurantRepository.create({
            ...createRestaurantDto,
            owner: user,
        });

        const savedRestaurant = await this.restaurantRepository.save(restaurant);

        // Update user with restaurant
        user.restaurant = savedRestaurant;
        await this.userRepository.save(user);

        return savedRestaurant;
    }

    async getProfile(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['restaurant'],
            select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }
}
