import axios, { AxiosRequestConfig } from "axios";

type FetcherOptions = {
  method?: string;
  params?: Record<string, any>;
  data?: Record<string, any>;
};

const fetcher = async (url: string, options?: FetcherOptions): Promise<any> => {
  try {
    const response = await axios({
      url: `${process.env.SERVER_URL}/${url}`,
      method: options?.method || "get",
      params: options?.params || {},
      data: options?.data || {},
      withCredentials: true,
    } as AxiosRequestConfig);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message || "Error fetching data";
  }
};

export default fetcher;
