import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Restaurant, User]),
        UploadModule,
    ],
    controllers: [RestaurantController],
    providers: [RestaurantService],
})
export class RestaurantModule { }
