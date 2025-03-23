import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Loader } from "lucide-react";
import axios from "axios";

interface CitySuggestion {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onAddCity: (cityName: string, lat: number, lon: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddCity }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=5472d85f1779228033b3c82a4a55edf6`
        );
        setSuggestions(
          response.data.map(
            (city: {
              name: string;
              state: string;
              country: string;
              lat: number;
              lon: number;
            }) => ({
              name: city.name,
              state: city.state,
              country: city.country,
              lat: city.lat,
              lon: city.lon,
            })
          )
        );
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectCity = (city: CitySuggestion) => {
    onAddCity(city.name, city.lat, city.lon);
    setSearchQuery("");
    setSuggestions([]);
    inputRef.current?.blur();
  };

  return (
    <div className="relative flex-grow">
      <motion.div
        className={`flex items-center bg-white rounded-lg overflow-hidden shadow-md 
                   ${isFocused ? "ring-2 ring-indigo-400" : ""}`}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Search className="ml-4 text-indigo-500" size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-4 outline-none text-gray-700"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {searchQuery && (
          <motion.button
            className="p-2 mr-2 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchQuery("")}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} />
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence>
        {suggestions.length > 1 && (
          <motion.div
            className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((city, index) => (
              <motion.div
                key={`${city.name}-${city.lat}-${city.lon}`}
                className="border-b border-gray-100 last:border-b-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.button
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors flex items-center"
                  onClick={() => handleSelectCity(city)}
                  whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                >
                  <MapPin
                    size={16}
                    className="text-indigo-500 mr-2 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800">
                      {city.name}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      {city.state ? `${city.state}, ` : ""}
                      {city.country}
                    </span>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {isLoading && searchQuery.length >= 2 && (
          <motion.div
            className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg p-4 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center text-indigo-500">
              <Loader size={18} className="animate-spin mr-2" />
              <span className="text-gray-600">Searching cities...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;

const X = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
