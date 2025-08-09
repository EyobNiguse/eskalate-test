import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Meal } from "../types";
import { mealApi, restaurantApi } from "../services/api";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMeal, setShowAddMeal] = useState(false);

  // Add meal form
  const [mealName, setMealName] = useState("");
  const [mealPrice, setMealPrice] = useState("");
  const [mealDescription, setMealDescription] = useState("");

  useEffect(() => {
    const fetchMyMeals = async () => {
      try {
        const response = await mealApi.getMy();
        setMeals(response.data.data);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyMeals();
  }, []);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newMeal = await mealApi.create({
        name: mealName,
        description: mealDescription,
        price: parseFloat(mealPrice),
        isAvailable: true,
      });

      setMeals([newMeal.data, ...meals]);
      setMealName("");
      setMealPrice("");
      setMealDescription("");
      setShowAddMeal(false);
    } catch (error) {
      console.error("Failed to add meal:", error);
    }
  };

  const handleImageUpload = async (mealId: number, file: File) => {
    try {
      await mealApi.uploadImage(mealId, file);
      // Refresh meals to show updated image
      const response = await mealApi.getMy();
      setMeals(response.data.data);
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard - {user?.restaurant?.name}
        </h1>
        <button
          onClick={() => setShowAddMeal(!showAddMeal)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddMeal ? "Cancel" : "Add Meal"}
        </button>
      </div>

      {showAddMeal && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Meal</h2>
          <form onSubmit={handleAddMeal} className="space-y-4">
            <input
              type="text"
              placeholder="Meal Name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={mealPrice}
              onChange={(e) => setMealPrice(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Description"
              value={mealDescription}
              onChange={(e) => setMealDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Meal
            </button>
          </form>
        </div>
      )}

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

              <div className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(meal.id, file);
                  }}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {meals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No meals found. Add your first meal!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
