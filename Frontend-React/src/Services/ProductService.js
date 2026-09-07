
import axios from "axios";
import api from "./Api";
const API_URL = "http://localhost:5290/api/Products";
export const getProducts = async ({
  search = "",
  categoryId = "",
  minPrice = "",
  maxPrice = "",
  sortBy = "",
  page = 1,
  pageSize = 10,
} = {}) => {
  const response = await api.get("/Products", {
    params: {
      search: search || undefined,
      categoryId: categoryId || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sortBy: sortBy || undefined,
      page,
      pageSize,
    },
  });

  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};
export const addProduct = async (product) => {
  const response = await api.post(API_URL, product);
  return response.data;
};
export const deleteProduct = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};
export const updateProduct = async (id, product) => {
  const response = await api.put(`${API_URL}/${id}`, product);
  return response.data;
};