import api from "../services/axiosApi";

export const addSaleApi = async (data: any) => {
  try {
    const response = await api.post("/sale", data);
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const updateSaleApi = async ({id,data}: any) => {
    console.log("api sale", id);
    
  try {
    const response = await api.put(`/sale/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const getAllSaleApi = async () => {
  try {
    const response = await api.get("/sale");
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const getSaleByIDApi = async (id: string) => {
  try {
    const response = await api.get(`/sale/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
