import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://stayfinder-s425.onrender.com/api",
  withCredentials: true,
});

// Add request interceptor for debugging (only in development)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (process.env.NODE_ENV === "development") {
//       console.log(
//         "Axios - Making request:",
//         config.method?.toUpperCase(),
//         config.url
//       );
//     }
//     return config;
//   },
//   (error) => {
//     console.error("Axios - Request error:", error);
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor for debugging
// axiosInstance.interceptors.response.use(
//   (response) => {
//     if (process.env.NODE_ENV === "development") {
//       console.log(
//         "Axios - Response received:",
//         response.status,
//         response.config.url
//       );
//     }
//     return response;
//   },
//   (error) => {
//     // Don't log 401 errors as they're expected when user is not logged in
//     if (error.response?.status !== 401) {
//       console.error("Axios - Response error:", error.message);
//       if (error.code === "ERR_NETWORK") {
//         console.error("Network error - check if backend server is running");
//       }
//     }
//     return Promise.reject(error);
//   }
// );
