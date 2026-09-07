import api from "./Api";

const API_URL = "http://localhost:5290/api/Category";

export const getCategories = async () => {
  const response = await api.get(API_URL);
  return response.data;
};
export const addCategory = async (category) => {
  const response = await api.post(API_URL, category);
  return response.data;
};
