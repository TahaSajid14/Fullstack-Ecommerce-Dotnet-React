import api from "./Api";

export const checkout = async () => {
  const response = await api.post("/Order/checkout");
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/Order/my-orders");
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get("/Order/all");
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/Order/${id}/status`, status, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};