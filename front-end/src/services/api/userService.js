import axiosInstance from "./axios/axiosInstance";

function getLoggedInUser() {
  return axiosInstance.get("/user");
}

function getUser(userId) {
  return axiosInstance.get(`/user/${userId}`);
}

function createUser(userData) {
  return axiosInstance.post("/user", userData);
}

function updateUser(userId, userData) {
  return axiosInstance.put(`/user/${userId}`, userData);
}

export default {
  getLoggedInUser,
  getUser,
  createUser,
  updateUser,
};
