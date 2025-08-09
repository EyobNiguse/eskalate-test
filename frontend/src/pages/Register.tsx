import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authApi } from "../services/api";

const Register: React.FC = () => {
  const [userType, setUserType] = useState<"customer" | "restaurant_owner">(
    "customer"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Restaurant owner fields
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;

      if (userType === "customer") {
        response = await authApi.registerCustomer({
          email,
          password,
          firstName,
          lastName,
        });
      } else {
        response = await authApi.registerRestaurantOwner({
          email,
          password,
          firstName,
          lastName,
          restaurantName,
          restaurantAddress,
        });
      }

      login(response.data.access_token, response.data.user);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setUserType("customer")}
            className={`px-4 py-2 rounded ${
              userType === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setUserType("restaurant_owner")}
            className={`px-4 py-2 rounded ${
              userType === "restaurant_owner"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Restaurant Owner
          </button>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            {userType === "restaurant_owner" && (
              <>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Restaurant Name"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Restaurant Address"
                  value={restaurantAddress}
                  onChange={(e) => setRestaurantAddress(e.target.value)}
                />
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
