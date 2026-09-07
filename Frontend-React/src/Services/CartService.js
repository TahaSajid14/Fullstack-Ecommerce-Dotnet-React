import api from "./Api";
export const getCart = async () => {
  const response = await api.get("/Cart");
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post("/Cart", {
    productId,
    quantity,
  });

  return response.data;
};

export const updateCartQuantity = async (id, quantity) => {
  const response = await api.put(`/Cart/${id}`, {
    productId: 0,
    quantity,
  });

  return response.data;
};

export const removeFromCart = async (id) => {
  const response = await api.delete(`/Cart/${id}`);
  return response.data;
};
