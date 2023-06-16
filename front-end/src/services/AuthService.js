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

export default {
  login,
  logout,
};
