import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MealModule } from './meal/meal.module';
import { User } from './entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import { Meal } from './entities/meal.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Restaurant, Meal],
      synchronize: true, // Don't use in production
    }),
    AuthModule,
    RestaurantModule,
    MealModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
