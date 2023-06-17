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
    const response = await Axios.post("/auth/generate-otp", { email });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
}

async function verifyOTP(email, otp) {
  try {
    const response = await Axios.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
}

async function resetPassword(email, otp, password) {
  try {
    const response = await Axios.put("/auth/reset-password", { email, otp, password });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
}

export default {
  login,
  logout,
  sendOTP,
  verifyOTP,
  resetPassword,
};
