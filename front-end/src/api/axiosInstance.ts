import axios from "axios";
import { toast } from "react-toastify";

type ResponseType = {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
};

const Axios = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export default Axios;
