# Restaurant Management Frontend

A comprehensive React TypeScript frontend application showcasing the JWT Authentication API for restaurant management systems.

## 🌟 Overview

This frontend application serves as a demonstration of a robust restaurant management API, featuring authentication, restaurant management, meal operations, and image upload capabilities. Built with modern React patterns and TypeScript for type safety.

## 🚀 Features

### Authentication System

- **Customer Registration**: Register as a customer to browse restaurants and meals
- **Restaurant Owner Registration**: Register with restaurant details (auto-creates restaurant)
- **JWT Authentication**: Secure login/logout with automatic token management
- **Role-based Access Control**: Different features based on user permissions

### Restaurant Features

- **Public Restaurant Listing**: Browse all restaurants with images and details
- **Restaurant Profiles**: View restaurant information, cuisine type, and location
- **Image Display**: Restaurant profile images with fallback handling

### Meal Management

- **Public Meal Browsing**: View all meals across restaurants with pricing
- **Restaurant Owner Dashboard**: Manage restaurant meals and operations
- **Meal Creation**: Add new meals with descriptions, pricing, and availability
- **Image Upload**: Upload and manage meal images with validation
- **Real-time Updates**: Immediate UI updates after API operations

### User Experience

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: Comprehensive error messages and fallbacks
- **Navigation**: Intuitive navigation with role-based menu items

## 🛠️ Technology Stack

- **React 18** with TypeScript for type safety
- **React Router DOM** for client-side routing
- **Axios** for HTTP requests with interceptors
- **Tailwind CSS** for modern, responsive styling
- **React Context** for state management
- **React Hook Form** integration ready

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.tsx       # Main navigation component
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication state management
├── pages/               # Application pages/screens
│   ├── Login.tsx        # User authentication
│   ├── Register.tsx     # User registration (customer/owner)
│   ├── RestaurantList.tsx # Public restaurant browsing
│   ├── MealList.tsx     # Public meal browsing
│   └── Dashboard.tsx    # Restaurant owner management
├── services/            # API integration layer
│   └── api.ts          # Axios client with interceptors
├── types/              # TypeScript type definitions
│   └── index.ts        # All interface definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🔧 Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running on `http://localhost:3000`

### Installation Steps

1. **Clone and navigate to the frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: `http://localhost:3001`
   - Backend API: `http://localhost:3000` (must be running)

## 📋 Available Scripts

```bash
npm start          # Start development server
npm build          # Build for production
npm test           # Run test suite
npm run lint       # Run ESLint
```

## 🔌 API Integration

### Backend Dependencies

Ensure your backend API is running with these endpoints:

| Endpoint                                           | Purpose                       | Auth Required |
| -------------------------------------------------- | ----------------------------- | ------------- |
| `POST /api/auth/register/customer`                 | Customer registration         | No            |
| `POST /api/auth/register/restaurant-owner`         | Restaurant owner registration | No            |
| `POST /api/auth/login`                             | User authentication           | No            |
| `GET /api/auth/profile`                            | Get user profile              | Yes           |
| `GET /api/restaurants`                             | List all restaurants          | No            |
| `GET /api/restaurants/:id`                         | Get restaurant details        | No            |
| `GET /api/restaurants/my/restaurant`               | Get own restaurant            | Yes (Owner)   |
| `PATCH /api/restaurants/my/restaurant`             | Update own restaurant         | Yes (Owner)   |
| `POST /api/restaurants/my/restaurant/upload-image` | Upload restaurant image       | Yes (Owner)   |
| `GET /api/meals`                                   | List all meals                | No            |
| `GET /api/meals/my/meals`                          | Get own meals                 | Yes (Owner)   |
| `POST /api/meals`                                  | Create new meal               | Yes (Owner)   |
| `PATCH /api/meals/:id`                             | Update meal                   | Yes (Owner)   |
| `POST /api/meals/:id/upload-image`                 | Upload meal image             | Yes (Owner)   |
| `DELETE /api/meals/:id`                            | Delete meal                   | Yes (Owner)   |

### API Client Features

- **Automatic JWT Token Management**: Tokens stored in localStorage
- **Request Interceptors**: Auto-attach Bearer tokens to requests
- **Response Interceptors**: Handle 401 errors and redirect to login
- **Error Handling**: Consistent error response processing
- **File Upload Support**: Multipart form data for image uploads

## 👥 User Roles & Permissions

### Customer

- Browse all restaurants and meals
- View restaurant details and meal information
- No administrative capabilities

### Restaurant Owner

- All customer capabilities
- Access to restaurant management dashboard
- Create, update, and delete meals
- Upload meal images
- Manage restaurant information
- View own restaurant's meal listings

### Admin (API Ready)

- Full system access (implementation ready)
- User management capabilities (extendable)

## 🖥️ Usage Guide

### For Customers

1. **Registration**

   ```
   Navigate to /register → Select "Customer" → Fill form → Auto-login
   ```

2. **Browsing**
   ```
   Home page → View restaurants → Click "View Details" → Browse meals
   Meals page → View all meals across restaurants
   ```

### For Restaurant Owners

1. **Registration & Setup**

   ```
   Navigate to /register → Select "Restaurant Owner" → Fill restaurant details → Auto-login
   ```

2. **Managing Meals**

   ```
   Dashboard → "Add Meal" → Fill details → Upload image → Manage existing meals
   ```

3. **Meal Operations**
   ```
   Add new meals with pricing and descriptions
   Upload high-quality meal images
   Update meal availability and pricing
   View meal performance and details
   ```

## 🎨 UI/UX Features

### Design Principles

- **Minimalist Design**: Clean, focused interface prioritizing functionality
- **Mobile-First**: Responsive design that works on all devices
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Performance**: Optimized loading and smooth transitions

### Key UI Components

- **Navigation Bar**: Role-based menu with user greeting
- **Card Layouts**: Consistent card design for restaurants and meals
- **Forms**: Clean, validated forms with error handling
- **Loading States**: Spinner animations during API calls
- **Image Handling**: Optimized image display with fallbacks

## 🔒 Security Features

### Authentication Security

- **JWT Token Storage**: Secure localStorage implementation
- **Automatic Logout**: Token expiration handling
- **Route Protection**: Role-based access control
- **API Security**: Bearer token authentication

### Input Validation

- **Form Validation**: Client-side validation for all forms
- **File Upload Validation**: Image type and size restrictions
- **Type Safety**: Full TypeScript implementation

## 🐛 Error Handling

### API Error Management

```typescript
// Automatic error handling in API client
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on authentication errors
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### User-Friendly Error Messages

- Network errors with retry suggestions
- Validation errors with specific field feedback
- Upload errors with file requirement details
- Authentication errors with clear next steps

## 🔧 Configuration

### Environment Variables

```bash
# Optional: Custom API base URL
REACT_APP_API_BASE_URL=http://localhost:3000

# Optional: Upload file size limit
REACT_APP_MAX_FILE_SIZE=5242880  # 5MB
```

### Proxy Configuration

The `package.json` includes a proxy setting for development:

```json
{
  "proxy": "http://localhost:3000"
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deployment Considerations

- Ensure backend API is accessible from production environment
- Configure proper CORS settings on backend
- Update API base URL for production
- Set up static file serving for the build directory

## 🔄 API Response Examples

### Authentication Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "owner@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "restaurant_owner",
    "restaurant": {
      "id": 1,
      "name": "Delicious Bites",
      "description": "The best Italian food in town"
    }
  }
}
```

### Meal Listing Response

```json
{
  "data": [
    {
      "id": 1,
      "name": "Margherita Pizza",
      "description": "Fresh tomatoes, mozzarella cheese, and basil",
      "price": 15.99,
      "image": "meal-image.jpg",
      "isAvailable": true,
      "restaurant": {
        "id": 1,
        "name": "Italian Bistro",
        "cuisine": "Italian"
      }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

## 🎯 Future Enhancements

### Planned Features (API Ready)

- **Search & Filtering**: Advanced meal and restaurant search
- **Pagination**: Full pagination implementation for large datasets
- **Favorites**: Customer favorite restaurants and meals
- **Reviews**: Rating and review system
- **Order Management**: Basic ordering workflow
- **Analytics**: Restaurant owner analytics dashboard

### Technical Improvements

- **State Management**: Redux Toolkit for complex state
- **Testing**: Comprehensive test suite with Jest and React Testing Library
- **PWA Features**: Offline capability and push notifications
- **Internationalization**: Multi-language support

## 📞 Support & Documentation

### API Documentation

- **Swagger UI**: `http://localhost:3000/api/docs`
- **Interactive Testing**: Full API testing interface
- **Schema Documentation**: Complete request/response examples

### Development Resources

- **TypeScript Types**: Comprehensive type definitions in `/src/types/`
- **Component Documentation**: Inline comments and JSDoc
- **API Integration Examples**: Complete usage examples in service files

## 📄 License

This project is part of a restaurant management system demonstration and is intended for educational and portfolio purposes.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

_This frontend application demonstrates a production-ready approach to building React applications with proper authentication, state management, and API integration._
