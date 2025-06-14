import { getInfoApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

const useUserAuth = () => {
  const { accessToken } = useAuthStore.getState();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["user-auth-info"],
    queryFn: getInfoApi,
    enabled: !!accessToken,
    // retry: false,
  });

  return {
  data,
    isError,
    isLoading,
    isAuthenticated: Boolean(data && accessToken),
  };
};

export default useUserAuth;
