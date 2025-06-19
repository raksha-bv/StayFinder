import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://stayfinder-s425.onrender.com/api",
  withCredentials: true,
});

// Set token from localStorage on app start
const token = localStorage.getItem('token');
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(
      "Axios - Making request:",
      config.method?.toUpperCase(),
      config.url
    );

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
    if (error.response?.status === 401) {
      // Clear token on 401
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
    
    if (error.response?.status !== 401) {
      console.error("Axios - Response error:", error.message);
      if (error.code === "ERR_NETWORK") {
        console.error("Network error - check if backend server is running");
      }
    }
    return Promise.reject(error);
  }
);
