import { getAllProductApi, getProductByIDApi } from "@/api/productApi";
import { useQuery } from "@tanstack/react-query";

export const useGetProductList = () => {
    const { isPending, isError, data } = useQuery({
      queryKey: ["get-product-list"],
      queryFn: getAllProductApi,
    });
    return {isLoading: isPending, isError, data}
}
export const useGetProductByID = (id:string) => {
    const { isPending, isError, data } = useQuery({
      queryKey: ["get-product-by-id"],
      queryFn: () => getProductByIDApi(id),
    });
    return {isLoading: isPending, isError, data}
}