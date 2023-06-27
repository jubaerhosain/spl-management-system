import axiosInstance from "./axios/axiosInstance";

export function getLoggedInUser() {
  return axiosInstance.get("/user");
}

export function getUser(userId) {
  return axiosInstance.get(`/user/${userId}`);
}

export function createUser(userData) {
  return axiosInstance.post("/user", userData);
}

export function updateUser(userId, userData) {
  return axiosInstance.put(`/user/${userId}`, userData);
}
