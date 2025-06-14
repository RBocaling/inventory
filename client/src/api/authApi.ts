import api from "../services/axiosApi"

export const registerApi = async (data: any) => {
    try {
        const response = await api.post("/auth/register", data);
        return response.data
    } catch (error) {
        throw new Error(error as any)
    }
};

export const loginApi = async (data: any) => {
    try {
        const response = await api.post("/auth/login", data);
        return response.data
    } catch (error) {
        throw new Error(error as any)
    }
};

export const getInfoApi = async () => {
    try {
        const response = await api.get("/auth/get-info");
        return response.data
    } catch (error) {
        throw new Error(error as any)
    }
};
export const getUserListApi = async () => {
    try {
        const response = await api.get("/auth/get-user-list");
        return response.data
    } catch (error) {
        throw new Error(error as any)
    }
};
export const getUserByIDApi = async (id:number) => {
    try {
        const response = await api.get(`/auth/get-user-by-id/${id}`);
        return response.data
    } catch (error) {
        throw new Error(error as any)
    }
};

export const updateUserApi = async (data:any) => {
  try {
    const response = await api.put(`/auth/update-user/${data?.id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};