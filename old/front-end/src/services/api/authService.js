import { AxiosError } from "axios";
import axiosInstance from "./axios/axiosInstance.js";

async function checkAuthentication() {
  try {
    const response = await axiosInstance.get("/auth/check-authentication");
    return response.data;
  } catch (err) {
    if (err.response) return err.response.data;
    return {};
  }
}

async function login(data) {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch (err) {
    if (err.response) return err.response.data;
    return {};
  }
}

async function logout() {
  try {
    const response = await axiosInstance.delete("/auth/logout");
    return response.data;
  } catch (err) {
    if (err.response) return err.response.data;
    return {};
  }
}

async function sendOTP(email) {
  try {
    const response = await axiosInstance.post("/auth/generate-otp", { email });
    return response.data;
  } catch (err) {
    if (err.response) return err.response.data;
    return {};
  }
}

async function verifyOTP(email, otp) {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (err) {
    if (err.response) return err.response.data;
    return {};
  }
}

async function resetPassword(email, otp, password) {
  try {
    const response = await axiosInstance.put("/auth/reset-password", { email, otp, password });
    return response.data;
  } catch (err) {
    throw new AxiosError(err);
  }
}

export default {
  checkAuthentication,
  login,
  logout,
  sendOTP,
  verifyOTP,
  resetPassword,
};
