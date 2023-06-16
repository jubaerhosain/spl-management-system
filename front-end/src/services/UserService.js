import Axios from "@utils/api";

async function getLoggedInUser() {
  try {
    const response = await Axios.get("/user");
    return response.data;
  } catch (err) {
    return err.response.data;
  }
}

export default {
  getLoggedInUser,
};
