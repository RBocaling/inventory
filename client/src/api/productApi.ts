import api from "../services/axiosApi";

export const addProductApi = async (data: any) => {
  try {
    const response = await api.post("/product", data);
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const updateProductApi = async (data: any) => {
  try {
    const response = await api.put(`/product/${data?.id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const getAllProductApi = async () => {
  try {
    const response = await api.get("/product");
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
export const getProductByIDApi = async (id:string) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
