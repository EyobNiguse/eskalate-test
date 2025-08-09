# Restaurant Management Frontend

A simple React frontend application to demonstrate the JWT Authentication API for restaurant management.

## Features

- **Authentication**: Login and registration for customers and restaurant owners
- **Restaurant Listing**: View all restaurants with images and details
- **Meal Listing**: Browse all available meals with pricing
- **Restaurant Owner Dashboard**: Manage meals and upload images
- **Image Upload**: Upload and display restaurant and meal images
- **Role-based Access**: Different features based on user roles

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. The application will be available at `http://localhost:3001`

## Backend Requirements

Make sure your backend API is running on `http://localhost:3000` with the following endpoints available:

- `/api/auth/*` - Authentication endpoints
- `/api/restaurants/*` - Restaurant management
- `/api/meals/*` - Meal management
- `/uploads/*` - Static file serving for images

## Usage

### As a Customer

1. Register as a customer
2. Browse restaurants and meals
3. View restaurant details and meal listings

### As a Restaurant Owner

1. Register as a restaurant owner (includes restaurant creation)
2. Access the Dashboard to manage your meals
3. Add new meals with descriptions and pricing
4. Upload images for your meals
5. View your restaurant's meal listings

## API Integration

The frontend demonstrates all major API features:

- JWT token authentication with automatic token management
- Customer and restaurant owner registration flows
- Restaurant and meal CRUD operations
- Image upload functionality
- Role-based access control
- Error handling and loading states

## Key Components

- **AuthContext**: Manages authentication state and user sessions
- **ProtectedRoute**: Enforces role-based access control
- **API Client**: Axios-based client with JWT token interceptors
- **Pages**: Simple, focused pages for each major feature
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS

This frontend serves as a comprehensive demonstration of the backend API capabilities while maintaining a simple, clean interface.
