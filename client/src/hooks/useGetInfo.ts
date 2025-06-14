import {  getInfoApi, getUserListApi } from "@/api/authApi";
import type { userType } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";

type propsType ={
    message: string,
    data:userType[]
}
export const useGetUserList = () => {
  const { isPending, isError, data } = useQuery<propsType>({
    queryKey: ["get-user-list"],
    queryFn: getUserListApi,
  });
 
    

  return {
    isLoading: isPending,
    isError,
    data: data as any
  };
};



export const useGetInfo = () => {
  const { data, isError, isLoading } = useQuery({
      queryKey: ["user-auth-info"],
      queryFn: getInfoApi,
      retry: false,
  });
  
  return {
    data,
    isError,
    isLoading
  }
}