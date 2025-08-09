import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Meal } from '../entities/meal.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { CreateMealDto, UpdateMealDto } from './dto/meal.dto';
import { MealFilterDto, PaginatedResponseDto } from './dto/pagination.dto';
import { UploadService } from '../upload/upload.service';
import { UserWithRestaurant } from '../types/entities';
import { Multer } from 'multer';

@Injectable()
export class MealService {
    constructor(
        @InjectRepository(Meal)
        private mealRepository: Repository<Meal>,
        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private uploadService: UploadService,
    ) { }

    async findAllPaginated(filters: MealFilterDto): Promise<PaginatedResponseDto<Meal>> {
        const { page = 1, limit = 10, search, restaurantId, isAvailable, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;

        const queryBuilder = this.mealRepository
            .createQueryBuilder('meal')
            .leftJoinAndSelect('meal.restaurant', 'restaurant')
            .leftJoinAndSelect('restaurant.owner', 'owner')
            .select([
                'meal',
                'restaurant.id',
                'restaurant.name',
                'restaurant.address',
                'restaurant.cuisine',
                'restaurant.profileImage',
                'owner.id',
                'owner.firstName',
                'owner.lastName',
            ]);

        // Apply filters
        if (search) {
            queryBuilder.andWhere(
                '(LOWER(meal.name) LIKE LOWER(:search) OR LOWER(meal.description) LIKE LOWER(:search))',
                { search: `%${search}%` }
            );
        }

        if (restaurantId) {
            queryBuilder.andWhere('meal.restaurantId = :restaurantId', { restaurantId });
        }

        if (isAvailable !== undefined) {
            queryBuilder.andWhere('meal.isAvailable = :isAvailable', { isAvailable });
        }

        if (minPrice !== undefined) {
            queryBuilder.andWhere('meal.price >= :minPrice', { minPrice });
        }

        if (maxPrice !== undefined) {
            queryBuilder.andWhere('meal.price <= :maxPrice', { maxPrice });
        }

        // Apply sorting
        queryBuilder.orderBy(`meal.${sortBy}`, sortOrder);

        // Apply pagination
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);

        // Get results and count
        const [data, total] = await queryBuilder.getManyAndCount();

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasNext,
                hasPrev,
            },
        };
    }

    async findOne(id: number): Promise<Meal> {
        const meal = await this.mealRepository.findOne({
            where: { id },
            relations: ['restaurant', 'restaurant.owner'],
            select: {
                restaurant: {
                    id: true,
                    name: true,
                    address: true,
                    cuisine: true,
                    profileImage: true,
                    owner: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!meal) {
            throw new NotFoundException('Meal not found');
        }

        return meal;
    }

    async findByRestaurantOwner(ownerId: number, filters: MealFilterDto): Promise<PaginatedResponseDto<Meal>> {
        const user = await this.userRepository.findOne({
            where: { id: ownerId },
            relations: ['restaurant'],
        });

        if (!user || !user.restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        // Add restaurant filter to only show meals from the owner's restaurant
        const filtersWithRestaurant = { ...filters, restaurantId: user.restaurant.id };
        return this.findAllPaginated(filtersWithRestaurant);
    }

    async create(ownerId: number, createMealDto: CreateMealDto): Promise<Meal> {
        const user = await this.userRepository.findOne({
            where: { id: ownerId },
            relations: ['restaurant'],
        });

        if (!user || !user.restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        const meal = this.mealRepository.create({
            ...createMealDto,
            restaurantId: user.restaurant.id,
        });

        return this.mealRepository.save(meal);
    }

    async update(ownerId: number, mealId: number, updateMealDto: UpdateMealDto): Promise<Meal> {
        const meal = await this.findMealByOwner(ownerId, mealId);

        Object.assign(meal, updateMealDto);
        return this.mealRepository.save(meal);
    }

    async delete(ownerId: number, mealId: number): Promise<{ message: string }> {
        const meal = await this.findMealByOwner(ownerId, mealId);

        // Delete image if exists
        if (meal.image) {
            this.uploadService.deleteFile(meal.image);
        }

        await this.mealRepository.remove(meal);
        return { message: 'Meal deleted successfully' };
    }

    async uploadMealImage(ownerId: number, mealId: number, file: Multer.File) {
        const meal = await this.findMealByOwner(ownerId, mealId);

        // Delete old image if exists
        if (meal.image) {
            this.uploadService.deleteFile(meal.image);
        }

        // Save new image
        const fileName = await this.uploadService.saveFile(file);
        const imageUrl = this.uploadService.getFileUrl(fileName);

        // Update meal with new image
        meal.image = fileName;
        await this.mealRepository.save(meal);

        return {
            message: 'Meal image uploaded successfully',
            imageUrl,
            fileName,
        };
    }

    async deleteMealImage(ownerId: number, mealId: number) {
        const meal = await this.findMealByOwner(ownerId, mealId);

        if (meal.image) {
            this.uploadService.deleteFile(meal.image);
            meal.image = undefined;
            await this.mealRepository.save(meal);
        }

        return { message: 'Meal image deleted successfully' };
    }

    private async findMealByOwner(ownerId: number, mealId: number): Promise<Meal> {
        const user = await this.userRepository.findOne({
            where: { id: ownerId },
            relations: ['restaurant'],
        });

        if (!user || !user.restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        const meal = await this.mealRepository.findOne({
            where: { id: mealId, restaurantId: user.restaurant.id },
            relations: ['restaurant'],
        });

        if (!meal) {
            throw new NotFoundException('Meal not found or you do not have permission to access it');
        }

        return meal;
    }
}
