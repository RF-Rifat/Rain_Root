import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import WeatherDashboard from "./Pages/WeatherDashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="bottom-right" reverseOrder={false} />
    <WeatherDashboard />
  </StrictMode>
);
