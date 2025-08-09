import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { Meal } from '../entities/meal.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Meal, Restaurant, User]),
        UploadModule,
    ],
    controllers: [MealController],
    providers: [MealService],
    exports: [MealService],
})
export class MealModule { }
