import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Restaurant } from "../types";
import { restaurantApi } from "../services/api";

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantApi.getAll();
        setRestaurants(response.data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Restaurants</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {restaurant.profileImage && (
              <img
                src={`/uploads/${restaurant.profileImage}`}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {restaurant.name}
              </h3>
              {restaurant.description && (
                <p className="text-gray-600 mb-2">{restaurant.description}</p>
              )}
              <p className="text-gray-500 text-sm mb-2">{restaurant.address}</p>
              {restaurant.cuisine && (
                <p className="text-blue-600 text-sm mb-4">
                  {restaurant.cuisine}
                </p>
              )}
              <Link
                to={`/restaurants/${restaurant.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No restaurants found.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
