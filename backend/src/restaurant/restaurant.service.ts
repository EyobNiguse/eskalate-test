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
import { UploadService } from '../upload/upload.service';
import { UserWithRestaurant, RestaurantWithOwner } from '../types/entities';
import { Multer } from 'multer';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private uploadService: UploadService,
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

    async uploadRestaurantImage(ownerId: number, file: Multer.File) {
        const user = await this.userRepository.findOne({
            where: { id: ownerId },
            relations: ['restaurant'],
        });

        if (!user || !user.restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        // Delete old image if exists
        if (user.restaurant.profileImage) {
            this.uploadService.deleteFile(user.restaurant.profileImage);
        }

        // Save new image
        const fileName = await this.uploadService.saveFile(file);
        const imageUrl = this.uploadService.getFileUrl(fileName);

        // Update restaurant with new image
        await this.restaurantRepository.update(user.restaurant.id, {
            profileImage: fileName,
        });

        return {
            message: 'Restaurant image uploaded successfully',
            imageUrl,
            fileName,
        };
    }

    async deleteRestaurantImage(ownerId: number) {
        const user = await this.userRepository.findOne({
            where: { id: ownerId },
            relations: ['restaurant'],
        });

        if (!user || !user.restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        // Delete image file if exists
        if (user.restaurant.profileImage) {
            this.uploadService.deleteFile(user.restaurant.profileImage);

            // Remove image reference from database
            await this.restaurantRepository.update(user.restaurant.id, {
                profileImage: undefined,
            });
        }

        return { message: 'Restaurant image deleted successfully' };
    }
}