# JWT Authentication API Documentation

This API provides JWT-based authentication with role-based access control for a restaurant management system.

## User Roles

- `customer`: Regular users
- `restaurant_owner`: Can create and manage restaurants
- `admin`: Full system access

## Authentication Endpoints

### POST /auth/register/customer

Register a new customer.

**Body:**

```json
{
  "email": "customer@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  }
}
```

### POST /auth/register/restaurant-owner

Register a new restaurant owner with restaurant details (automatically creates both user and restaurant).

**Body:**

```json
{
  "email": "owner@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "restaurantName": "Delicious Bites",
  "restaurantDescription": "The best Italian food in town",
  "restaurantAddress": "123 Main Street, City, State 12345",
  "restaurantPhone": "+1-555-0123",
  "restaurantCuisine": "Italian"
}
```

**Response:**

```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 2,
    "email": "owner@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "restaurant_owner",
    "restaurant": {
      "id": 1,
      "name": "Delicious Bites",
      "description": "The best Italian food in town",
      "address": "123 Main Street, City, State 12345",
      "phone": "+1-555-0123",
      "cuisine": "Italian"
    }
  }
}
```

### POST /auth/login

Login with email and password.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "restaurant": null // or restaurant object if user is restaurant owner
  }
}
```

### GET /auth/profile

Get current user's profile (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer",
  "restaurant": null,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

## Restaurant Endpoints

### GET /restaurants

Get all restaurants (public endpoint).

### GET /restaurants/:id

Get a specific restaurant by ID (public endpoint).

### GET /restaurants/my/restaurant

Get the current user's restaurant (requires restaurant owner role).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

### PATCH /restaurants/my/restaurant

Update the current user's restaurant (requires restaurant owner role).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Body:**

```json
{
  "name": "Updated Restaurant Name",
  "description": "Updated description",
  "address": "New address",
  "phone": "New phone",
  "cuisine": "New cuisine type"
}
```

### DELETE /restaurants/my/restaurant

Delete the current user's restaurant (requires restaurant owner role).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

## DTO Validations

### Customer Registration

- `email`: Must be a valid email address
- `password`: Minimum 6 characters
- `firstName`: 2-50 characters
- `lastName`: 2-50 characters

### Restaurant Owner Registration

- All customer validation rules plus:
- `restaurantName`: 2-100 characters
- `restaurantDescription`: 10-500 characters (optional)
- `restaurantAddress`: 10-200 characters
- `restaurantPhone`: 10-20 characters (optional)
- `restaurantCuisine`: 2-50 characters (optional)

### Restaurant Update

- All fields are optional
- Same validation rules as restaurant creation

## Authentication Guards

### JwtAuthGuard

Protects routes that require authentication. Add to any route that needs a logged-in user.

### RolesGuard

Protects routes based on user roles. Use with `@Roles()` decorator.

## Usage Examples

### Protecting a Route with Authentication

```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
async protectedRoute(@Request() req) {
  return req.user; // User from JWT token
}
```

### Protecting a Route with Role-Based Access

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RESTAURANT_OWNER)
@Post('restaurant-only')
async restaurantOwnerOnly(@Request() req) {
  return 'Only restaurant owners can access this';
}
```

## Key Features

1. **Separate Registration Flows**: Different endpoints for customers and restaurant owners
2. **Automatic Restaurant Creation**: Restaurant owners register with their restaurant details
3. **Comprehensive Validation**: Detailed validation messages for all inputs
4. **Role-based Access Control**: Secure endpoints based on user roles
5. **Restaurant Management**: Restaurant owners can update and manage their restaurants

## Environment Variables

Set these in your `.env` file:

```
JWT_SECRET=your-super-secret-jwt-key-here
```

## Database

The system uses SQLite by default. The database file `database.sqlite` will be created automatically when you start the application.

## Getting Started

1. Install dependencies: `npm install`
2. Set environment variables
3. Start the application: `npm run start:dev`
4. The API will be available at `http://localhost:3000`
