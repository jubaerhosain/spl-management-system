import Axios from "@utils/api";

async function login(data) {
  try {
    const response = await Axios.post("/auth/login", data);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
}

async function logout() {
  try {
    const response = await Axios.delete("/auth/logout");
    return response.data;
  } catch (err) {
    return err.response.data;
  }
}

async function sendOTP(email) {
  try {
    if (email) return {success: true, message:"An email has been sent successfully"};
  } catch (err) {
    return err.message;
  }
}

async function verifyOTP(email, otp) {}

async function resetPassword(email, otp, password) {}

export default {
  login,
  logout,
  sendOTP,
  verifyOTP,
  resetPassword,
};
