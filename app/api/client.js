import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTANT: replace with your computer's local IP (not "localhost")
// so your phone (running Expo Go) can reach the backend on your PC.
// Find it with `ipconfig` (Windows) -> "IPv4 Address", e.g. 192.168.1.5
export const BASE_URL = "http://192.168.100.76:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Attach the saved token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
