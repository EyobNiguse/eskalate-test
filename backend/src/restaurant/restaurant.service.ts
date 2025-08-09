import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { UpdateRestaurantDto } from './dto/restaurant.dto';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findAll() {
        return this.restaurantRepository.find({
            relations: ['owner'],
            select: {
                owner: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        });
    }

    async findOne(id: number) {
        const restaurant = await this.restaurantRepository.findOne({
            where: { id },
            relations: ['owner'],
            select: {
                owner: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        });

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        return restaurant;
    }

    async findByOwnerId(ownerId: number) {
        const user = await this.userRepository.findOne({
            where: { id: ownerId },
            relations: ['restaurant'],
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (!user.restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        return user.restaurant;
    }

    async updateByOwnerId(ownerId: number, updateData: UpdateRestaurantDto) {
        const user = await this.userRepository.findOne({
            where: { id: ownerId },
            relations: ['restaurant'],
        });

        if (!user || !user.restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        await this.restaurantRepository.update(user.restaurant.id, updateData);

        return this.restaurantRepository.findOne({
            where: { id: user.restaurant.id },
        });
    }

    async deleteByOwnerId(ownerId: number) {
        const user = await this.userRepository.findOne({
            where: { id: ownerId },
            relations: ['restaurant'],
        });

        if (!user || !user.restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        await this.restaurantRepository.remove(user.restaurant);

        // Clear restaurant reference from user
        user.restaurant = null;
        await this.userRepository.save(user);

        return { message: 'Restaurant deleted successfully' };
    }
}