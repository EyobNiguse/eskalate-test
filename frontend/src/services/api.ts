import axios, { AxiosResponse } from 'axios';
import {
    AuthResponse,
    CustomerRegisterDto,
    RestaurantOwnerRegisterDto,
    LoginDto,
    User,
    Restaurant,
    Meal,
    CreateMealDto,
    UpdateMealDto,
    UpdateRestaurantDto,
    PaginatedResponse,
    MealFilters,
} from '../types';

const API_BASE_URL = 'http://locahost:8000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    registerCustomer: (data: CustomerRegisterDto): Promise<AxiosResponse<AuthResponse>> =>
        api.post('/auth/register/customer', data),

    registerRestaurantOwner: (data: RestaurantOwnerRegisterDto): Promise<AxiosResponse<AuthResponse>> =>
        api.post('/auth/register/restaurant-owner', data),

    login: (data: LoginDto): Promise<AxiosResponse<AuthResponse>> =>
        api.post('/auth/login', data),

    getProfile: (): Promise<AxiosResponse<User>> =>
        api.get('/auth/profile'),
};

// Restaurant API
export const restaurantApi = {
    getAll: (): Promise<AxiosResponse<Restaurant[]>> =>
        api.get('/restaurants'),

    getById: (id: number): Promise<AxiosResponse<Restaurant>> =>
        api.get(`/restaurants/${id}`),

    getMy: (): Promise<AxiosResponse<Restaurant>> =>
        api.get('/restaurants/my/restaurant'),

    updateMy: (data: UpdateRestaurantDto): Promise<AxiosResponse<Restaurant>> =>
        api.patch('/restaurants/my/restaurant', data),

    uploadImage: (file: File): Promise<AxiosResponse<{ message: string; imageUrl: string; fileName: string }>> => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/restaurants/my/restaurant/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteImage: (): Promise<AxiosResponse<{ message: string }>> =>
        api.delete('/restaurants/my/restaurant/image'),

    deleteMy: (): Promise<AxiosResponse<{ message: string }>> =>
        api.delete('/restaurants/my/restaurant'),
};

// Meal API
export const mealApi = {
    getAll: (filters?: MealFilters): Promise<AxiosResponse<PaginatedResponse<Meal>>> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }
        return api.get(`/meals?${params.toString()}`);
    },

    getById: (id: number): Promise<AxiosResponse<Meal>> =>
        api.get(`/meals/${id}`),

    getMy: (filters?: MealFilters): Promise<AxiosResponse<PaginatedResponse<Meal>>> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }
        return api.get(`/meals/my/meals?${params.toString()}`);
    },

    create: (data: CreateMealDto): Promise<AxiosResponse<Meal>> =>
        api.post('/meals', data),

    update: (id: number, data: UpdateMealDto): Promise<AxiosResponse<Meal>> =>
        api.patch(`/meals/${id}`, data),

    uploadImage: (id: number, file: File): Promise<AxiosResponse<{ message: string; imageUrl: string; fileName: string }>> => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/meals/${id}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteImage: (id: number): Promise<AxiosResponse<{ message: string }>> =>
        api.delete(`/meals/${id}/image`),

    delete: (id: number): Promise<AxiosResponse<{ message: string }>> =>
        api.delete(`/meals/${id}`),
};

export default api;
