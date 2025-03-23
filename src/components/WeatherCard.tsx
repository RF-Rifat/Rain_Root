import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RefreshCw,
  Droplets,
  Wind,
  Thermometer,
  MapPin,
  Clock,
} from "lucide-react";
import { WeatherData } from "../../types/types";

interface WeatherCardProps {
  city: WeatherData;
  unit: "Celsius" | "Fahrenheit";
  removeCity: (cityName: string) => void;
  refreshCity: (cityName: string) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  unit,
  removeCity,
  refreshCity,
}) => {
  const [showForecast, setShowForecast] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getTempColor = (temp: number) => {
    if (temp < 0) return "text-blue-600";
    if (temp < 10) return "text-blue-400";
    if (temp < 20) return "text-green-500";
    if (temp < 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getBackgroundGradient = (tempKelvin: number) => {
    const temp = tempKelvin - 273.15;

    if (temp < 0) return "from-blue-100 to-blue-50";
    if (temp < 10) return "from-blue-50 to-indigo-50";
    if (temp < 20) return "from-green-50 to-blue-50";
    if (temp < 30) return "from-yellow-50 to-orange-50";
    return "from-orange-50 to-red-50";
  };

  const getWeatherIcon = (iconCode: string) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const toggleForecast = () => {
    setShowForecast(!showForecast);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshCity(city.name);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const temperature =
    unit === "Celsius"
      ? city.main.temp - 273.15
      : ((city.main.temp - 273.15) * 9) / 5 + 32;

  // Format the current time
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mock data for forecast (since actual API connection isn't implemented)
  const mockForecast = [
    { time: "12PM", temp: temperature - 1, icon: city.weather[0].icon },
    { time: "3PM", temp: temperature + 0.5, icon: city.weather[0].icon },
    { time: "6PM", temp: temperature - 0.8, icon: city.weather[0].icon },
    { time: "9PM", temp: temperature - 2, icon: city.weather[0].icon },
  ];

  return (
    <motion.div
      className={`rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br ${getBackgroundGradient(
        city.main.temp
      )}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)",
      }}
      layoutId={`weather-card-${city.name}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <motion.div className="flex items-center">
            <MapPin className="text-indigo-500 mr-2" size={18} />
            <h2 className="text-2xl font-bold text-gray-800">{city.name}</h2>
          </motion.div>
          <div className="flex space-x-2">
            <motion.button
              onClick={handleRefresh}
              className="p-2 rounded-full bg-white/70 backdrop-blur-sm text-indigo-500 hover:bg-indigo-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={
                isRefreshing
                  ? { duration: 1, repeat: Infinity, ease: "linear" }
                  : {}
              }
            >
              <RefreshCw size={16} />
            </motion.button>
            <motion.button
              onClick={() => removeCity(city.name)}
              className="p-2 rounded-full bg-white/70 backdrop-blur-sm text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          </div>
        </div>

        <div className="flex items-center mb-2">
          <Clock size={14} className="text-gray-500 mr-1" />
          <span className="text-xs text-gray-500">
            Updated at {formatTime()}
          </span>
        </div>

        <div className="flex justify-between items-center mb-6 p-3 bg-white/50 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center">
            <motion.img
              src={getWeatherIcon(city.weather[0].icon)}
              alt={city.weather[0].description}
              className="w-16 h-16"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span className="text-gray-600 text-sm capitalize">
              {city.weather[0].description}
            </span>
          </div>
          <motion.div
            className={`text-5xl font-bold ${getTempColor(temperature)}`}
            key={temperature} // Force animation when temperature changes
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {temperature.toFixed(1)}°{unit === "Celsius" ? "C" : "F"}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <motion.div
            className="flex items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg"
            whileHover={{ y: -2, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
          >
            <Droplets className="text-blue-500 mr-3" size={20} />
            <div>
              <div className="text-xs text-gray-500">Humidity</div>
              <div className="font-medium">{city.main.humidity}%</div>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg"
            whileHover={{ y: -2, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
          >
            <Wind className="text-blue-500 mr-3" size={20} />
            <div>
              <div className="text-xs text-gray-500">Wind Speed</div>
              <div className="font-medium">{city.wind.speed} m/s</div>
            </div>
          </motion.div>
        </div>

        <motion.button
          onClick={toggleForecast}
          className="w-full py-2.5 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Thermometer size={16} className="mr-2" />
          {showForecast ? "Hide forecast" : "Show hourly forecast"}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForecast && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="border-t border-gray-200"
          >
            <div className="p-4 bg-white/60 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Hourly Forecast
              </h3>
              <div className="flex justify-between">
                {mockForecast.map((forecast, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-xs text-gray-500">
                      {forecast.time}
                    </span>
                    <img
                      src={getWeatherIcon(forecast.icon)}
                      alt="Weather icon"
                      className="w-10 h-10 my-1"
                    />
                    <span
                      className={`text-sm font-medium ${getTempColor(
                        forecast.temp
                      )}`}
                    >
                      {forecast.temp.toFixed(1)}°
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeatherCard;
