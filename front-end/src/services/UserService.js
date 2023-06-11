import axios from "axios";
const base_url = "http://";

export default {
  getUser: async (id) => {
    try {
      const response = await axios.get(base_url + "users" + id);
      return response.data;
    } catch (err) {
      throw new Error(err);
    }
  },
};
