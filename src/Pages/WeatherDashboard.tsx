import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import { WeatherData } from "../../types/types";
import SearchBar from "../components/SearchBar";
import ToggleUnit from "../components/ToggleUnit";
import WeatherCard from "../components/WeatherCard";

const WeatherDashboard: React.FC = () => {
  const [cities, setCities] = useState<WeatherData[]>([]);
  const [unit, setUnit] = useState<"Celsius" | "Fahrenheit">("Celsius");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedCities = JSON.parse(localStorage.getItem("cities") || "[]");
    setCities(savedCities);
  }, []);

  const addCity = async (city: string) => {
    setLoading(true);
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5472d85f1779228033b3c82a4a55edf6`
      );
      const updatedCities = [...cities, response.data];
      setCities(updatedCities);
      localStorage.setItem("cities", JSON.stringify(updatedCities));
    } catch (error) {
      console.error("Error fetching city data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCity = async (cityName: string) => {
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=5472d85f1779228033b3c82a4a55edf6`
      );
      const updatedCities = cities.map((city) =>
        city.name === cityName ? response.data : city
      );
      setCities(updatedCities);
      localStorage.setItem("cities", JSON.stringify(updatedCities));
    } catch (error) {
      console.error("Error refreshing city data:", error);
    }
  };

  const removeCity = (cityName: string) => {
    const updatedCities = cities.filter((city) => city.name !== cityName);
    setCities(updatedCities);
    localStorage.setItem("cities", JSON.stringify(updatedCities));
  };

  const toggleUnit = () => {
    setUnit(unit === "Celsius" ? "Fahrenheit" : "Celsius");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto p-6">
        <motion.h1
          className="text-4xl font-bold text-center mb-6 text-indigo-800"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.1,
          }}
        >
          Weather Dashboard
        </motion.h1>

        <motion.div
          className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
          }}
        >
          <SearchBar onAddCity={addCity} />
          <ToggleUnit isCelsius={unit === "Celsius"} toggleUnit={toggleUnit} />
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center mt-16">
            <motion.div
              className="h-16 w-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-full h-full text-indigo-600"
                viewBox="0 0 24 24"
              >
                <motion.circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="50 50"
                  animate={{
                    rotate: 360,
                    transition: {
                      duration: 1.5,
                      ease: "linear",
                      repeat: Infinity,
                    },
                  }}
                />
              </svg>
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {cities.length === 0 ? (
                <motion.div
                  className="col-span-full flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src="/api/placeholder/200/200"
                    alt="Empty state"
                    className="w-32 h-32 mb-6 opacity-40"
                  />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No cities added yet
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Search for a city above to begin tracking weather conditions
                  </p>
                </motion.div>
              ) : (
                cities.map((city, index) => (
                  <WeatherCard
                    key={city.id || `city-${index}`}
                    city={city}
                    unit={unit}
                    removeCity={removeCity}
                    refreshCity={refreshCity}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WeatherDashboard;
