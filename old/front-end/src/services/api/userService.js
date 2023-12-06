import axiosInstance from "./axios/axiosInstance";

async function getLoggedInUser() {
  try {
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (err) {
    if (err.response) return err.response.data;
    return {};
  }
}

async function getUser(userId) {
  return axiosInstance.get(`/user/${userId}`);
}

async function createUser(userData) {
  return axiosInstance.post("/user", userData);
}

async function updateUser(userId, userData) {
  return axiosInstance.put(`/user/${userId}`, userData);
}

export default {
  getLoggedInUser,
  getUser,
  createUser,
  updateUser,
};
