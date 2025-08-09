import React, { useState, useEffect } from "react";
import { Meal } from "../types";
import { mealApi } from "../services/api";

const MealList: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await mealApi.getAll({ limit: 20 });
        setMeals(response.data.data);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Meals</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {meal.image && (
              <img
                src={`/uploads/${meal.image}`}
                alt={meal.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {meal.name}
              </h3>
              {meal.description && (
                <p className="text-gray-600 mb-3">{meal.description}</p>
              )}
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-green-600">
                  ${meal.price.toFixed(2)}
                </span>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    meal.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {meal.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <p className="font-medium">{meal.restaurant.name}</p>
                <p>{meal.restaurant.address}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {meals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No meals found.</p>
        </div>
      )}
    </div>
  );
};

export default MealList;
