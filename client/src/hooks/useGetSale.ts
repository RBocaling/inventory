import { getAllSaleApi, getSaleByIDApi } from "@/api/saleApi";
import { useQuery } from "@tanstack/react-query";

export const useGetSaleList = () => {
  const { isPending, isError, data } = useQuery({
    queryKey: ["get-sale-list"],
    queryFn: getAllSaleApi,
  });
  return { isLoading: isPending, isError, data };
};
export const useGetSaleById= (id:any) => {
  const { isPending, isError, data } = useQuery({
    queryKey: ["get-sale-list-id"],
    queryFn: () => getSaleByIDApi(id),
  });
  return { isLoading: isPending, isError, data };
};
