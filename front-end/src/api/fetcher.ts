import axiosInstance from "./axiosInstance";

const fetcher = async (url: string, params?: object): Promise<any> => {
  try {
    const response = await axiosInstance.get(url, {
      params: params || {},
      withCredentials: true,
    });
    return response.data?.data;
  } catch (error: any) {
    throw error.response?.data || error.message || "Error fetching data";
  }
};

export default fetcher;
