import { getAllCustomerApi, getCustomerByIDApi } from "@/api/customerApi";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerList = () => {
  const { isPending, isError, data } = useQuery({
    queryKey: ["get-Customer-list"],
    queryFn: getAllCustomerApi,
  });
  return { isLoading: isPending, isError, data };
};
export const useGetCustomerByID = (id: number) => {
  const { isPending, isError, data } = useQuery({
    queryKey: ["get-Customer-lis-by-idt"],
    queryFn: () => getCustomerByIDApi(id),
  });
  return { isLoading: isPending, isError, data };
};
