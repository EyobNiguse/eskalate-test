export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'customer' | 'restaurant_owner' | 'admin';
    restaurant?: Restaurant;
    createdAt?: string;
}

export interface Restaurant {
    id: number;
    name: string;
    description?: string;
    address: string;
    phone?: string;
    cuisine?: string;
    profileImage?: string;
    owner?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface Meal {
    id: number;
    name: string;
    description?: string;
    price: number;
    image?: string;
    isAvailable: boolean;
    restaurant: Restaurant;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface CustomerRegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface RestaurantOwnerRegisterDto extends CustomerRegisterDto {
    restaurantName: string;
    restaurantDescription?: string;
    restaurantAddress: string;
    restaurantPhone?: string;
    restaurantCuisine?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface CreateMealDto {
    name: string;
    description?: string;
    price: number;
    isAvailable: boolean;
}

export interface UpdateMealDto {
    name?: string;
    description?: string;
    price?: number;
    isAvailable?: boolean;
}

export interface UpdateRestaurantDto {
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    cuisine?: string;
    profileImage?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface MealFilters {
    page?: number;
    limit?: number;
    search?: string;
    restaurantId?: number;
    isAvailable?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
    sortOrder?: 'ASC' | 'DESC';
}
