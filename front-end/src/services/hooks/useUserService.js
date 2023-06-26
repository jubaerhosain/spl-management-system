import { useState } from "react";
import { getUser, createUser, updateUser, getLoggedInUser } from "../api/userService";

export function useUserService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchLoggedInUser() {
    const res = await getLoggedInUser();
    console.log(res);
  }

  async function fetchUser(userId) {
    try {
      setLoading(true);
      const response = await getUser(userId);
      // Process the response data if needed
      return response.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function addUser(userData) {
    try {
      setLoading(true);
      const response = await createUser(userData);
      // Process the response data if needed
      return response.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateUserById(userId, userData) {
    try {
      setLoading(true);
      const response = await updateUser(userId, userData);
      // Process the response data if needed
      return response.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    fetchLoggedInUser,
    fetchUser,
    addUser,
    updateUserById,
  };
}
