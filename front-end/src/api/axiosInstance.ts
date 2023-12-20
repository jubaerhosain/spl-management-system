import axios from "axios";
import {toast} from "react-toastify"

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

class AxiosInstance {
  static async post(url: any, data: any, config?: any | null): Promise<ResponseType | any> {
    try {
      const response = await Axios.post(url, data, config);
      return response.data;
    } catch (error: any) {
      if(error?.response?.status == 404) {
        toast.error("API not found");
      }
      else if (error?.response) {
        return error?.response?.data;
      } else {
        console.log(error);
        toast.error("Request failed");
        return null;
      }
    }
  }
}

export default AxiosInstance;
