import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "../config/config";

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/api/auth/signin`, {
    username,
    password,
  });
  return response.data; // Aquí asumir que response.data contiene la información del usuario
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem("user");
};

export const checkAuthStatus = async (userId: number) => {
  const userStorage = await AsyncStorage.getItem("user");
  if (userStorage) {
    return JSON.parse(userStorage);
  } else {
    const URL = `${API_URL}/api/auth/${userId}`;
    const response = await axios.get(URL);
    const user = response.data;
    if (user) {
      return user;
    }
  }
  return null;
};
