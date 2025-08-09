import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, User])],
    controllers: [RestaurantController],
    providers: [RestaurantService],
})
export class RestaurantModule { }
