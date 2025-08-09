// Type definitions for entities with relationships
import { User } from '../entities/user.entity';
import { Restaurant } from '../entities/restaurant.entity';

export interface UserWithRestaurant extends User {
    restaurant?: Restaurant | null;
}

export interface RestaurantWithOwner extends Restaurant {
    owner: User;
}
