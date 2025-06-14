import api from "../services/axiosApi";

export const addCustomerApi = async (data: any) => {
  try {
    const response = await api.post("/customer", data);
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const updateCustomerApi = async (data: any) => {
  try {
    const response = await api.put(`/customer/${data?.id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const getAllCustomerApi = async () => {
  try {
    const response = await api.get("/customer");
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const getCustomerByIDApi = async (id: number) => {
  try {
    const response = await api.get(`/customer/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
