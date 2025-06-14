import { getUserByIDApi } from './../api/authApi';
import type { userType } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";

type propsType ={
    message: string,
    data:userType[]
}
const useGetUserById = (id:number) => {
  const { isPending, isError, data } = useQuery<propsType>({
    queryKey: ["get-user-by-id"],
    queryFn: ()=>getUserByIDApi(id),
  });
 
    

  return {
    isLoading: isPending,
    isError,
    data: data as any
  };
};

export default useGetUserById;
