import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'apikey': API_KEY,
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation' 
  }
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API call failed:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export default httpClient;