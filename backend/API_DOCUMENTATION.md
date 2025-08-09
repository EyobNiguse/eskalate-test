# JWT Authentication API Documentation

This API provides JWT-based authentication with role-based access control for a restaurant management system, including image upload functionality.

## Swagger Documentation

The API includes interactive Swagger documentation with Bearer token authentication support:

- **URL**: `http://localhost:3000/docs`
- **Authentication**: Click the "Authorize" button and enter your JWT token

## User Roles

- `customer`: Regular users
- `restaurant_owner`: Can create and manage restaurants with image uploads
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
      "cuisine": "Italian",
      "profileImage": null
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

**Response:**

```json
[
  {
    "id": 1,
    "name": "Delicious Bites",
    "description": "The best Italian food in town",
    "address": "123 Main Street, City, State 12345",
    "phone": "+1-555-0123",
    "cuisine": "Italian",
    "profileImage": "unique-filename.jpg",
    "owner": {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "owner@example.com"
    }
  }
]
```

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
  "cuisine": "New cuisine type",
  "profileImage": "optional-image-filename.jpg"
}
```

## Image Upload Endpoints

### POST /restaurants/my/restaurant/upload-image

Upload a profile image for the restaurant (requires restaurant owner role).

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body:**

- Form field name: `file`
- Accepted formats: JPEG, PNG, WebP
- Maximum file size: 5MB

**Response:**

```json
{
  "message": "Restaurant image uploaded successfully",
  "imageUrl": "/uploads/unique-filename.jpg",
  "fileName": "unique-filename.jpg"
}
```

**File Validation:**

- Only image files (JPEG, PNG, WebP) are allowed
- Maximum file size: 5MB
- Automatic file name generation with UUID

### DELETE /restaurants/my/restaurant/image

Delete the restaurant's profile image (requires restaurant owner role).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Restaurant image deleted successfully"
}
```

### DELETE /restaurants/my/restaurant

Delete the current user's restaurant (requires restaurant owner role).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

## Static File Serving

Uploaded images are served at:

- **URL Pattern**: `http://localhost:3000/uploads/{filename}`
- **Example**: `http://localhost:3000/uploads/unique-filename.jpg`

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
- `profileImage`: Optional string (filename)

### Image Upload Validation

- **File Types**: JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp)
- **File Size**: Maximum 5MB
- **File Name**: Automatically generated UUID + original extension

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

### File Upload with Validation

```typescript
@UseInterceptors(FileInterceptor('file'))
async uploadImage(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
      ],
    }),
  )
  file: Multer.File,
) {
  // Handle file upload
}
```

## Key Features

1. **Separate Registration Flows**: Different endpoints for customers and restaurant owners
2. **Automatic Restaurant Creation**: Restaurant owners register with their restaurant details
3. **Comprehensive Validation**: Detailed validation messages for all inputs
4. **Role-based Access Control**: Secure endpoints based on user roles
5. **Image Upload System**: Secure file upload with validation and automatic cleanup
6. **Static File Serving**: Direct access to uploaded images via URL
7. **Swagger Documentation**: Interactive API documentation with authentication
8. **File Management**: Automatic old image deletion when uploading new ones

## Environment Variables

Set these in your `.env` file:

```
JWT_SECRET=your-super-secret-jwt-key-here
```

## Database

The system uses SQLite by default. The database file `database.sqlite` will be created automatically when you start the application.

## File Storage

- **Upload Directory**: `./uploads/` (created automatically)
- **File Naming**: UUID + original extension
- **Access URL**: `/uploads/{filename}`

## Getting Started

1. Install dependencies: `npm install`
2. Set environment variables
3. Start the application: `npm run start:dev`
4. The API will be available at `http://localhost:3000`
5. Access Swagger documentation at `http://localhost:3000/docs`
