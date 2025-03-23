import React from "react";
import { motion } from "framer-motion";

interface ToggleUnitProps {
  isCelsius: boolean;
  toggleUnit: () => void;
}

const ToggleUnit: React.FC<ToggleUnitProps> = ({ isCelsius, toggleUnit }) => {
  return (
    <motion.button
      onClick={toggleUnit}
      className="flex items-center justify-center px-4 py-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all md:flex-shrink-0"
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`w-12 h-6 rounded-full p-1 flex items-center ${
          isCelsius ? "bg-blue-100 justify-start" : "bg-red-100 justify-end"
        }`}
        animate={{
          backgroundColor: isCelsius
            ? "rgba(219, 234, 254, 1)"
            : "rgba(254, 226, 226, 1)",
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={`w-4 h-4 rounded-full ${
            isCelsius ? "bg-blue-500" : "bg-red-500"
          }`}
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </motion.div>
      <div className="flex flex-col ml-3">
        <div className="text-sm font-medium text-gray-800">
          Temperature Unit
        </div>
        <div className="text-xs text-gray-500">
          {isCelsius ? "Celsius (°C)" : "Fahrenheit (°F)"}
        </div>
      </div>
    </motion.button>
  );
};

export default ToggleUnit;
