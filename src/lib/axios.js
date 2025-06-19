import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(
      "Axios - Making request:",
      config.method?.toUpperCase(),
      config.url
    );
    console.log("Axios - Full URL:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("Axios - Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      "Axios - Response received:",
      response.status,
      response.config.url
    );
    return response;
  },
  (error) => {
    console.error("Axios - Response error:", error.message);
    if (error.code === "ERR_NETWORK") {
      console.error("Network error - check if backend server is running");
    }
    return Promise.reject(error);
  }
);
