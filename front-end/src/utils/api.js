import axios from "axios";

// Create a custom Axios instance
const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your API's base URL
  withCredentials: true, // Set this to true if you want to send cookies along with requests
});

export default AxiosInstance;
