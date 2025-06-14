import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { loginApi } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import useUserAuth from "@/hooks/useUserAuth";
import MessageError from "@/components/ui/messageError";
import Footer from "@/components/footer";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setToken = useAuthStore((state) => state.setTokens);
  const { isAuthenticated, isLoading } = useUserAuth();

   useEffect(() => {
      if (!isLoading && isAuthenticated) {
        navigate("/");
      }
   }, [isAuthenticated, isLoading]);
  
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setToken(data?.accessToken, data?.refreshToken); 
      navigate("/");
    },
      
  });

  const handleLogin = (e: any) => {
    e.preventDefault();
    loginMutation.mutate({email,password});
  };

  // if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pb-40 md:pb-0 overflow-y-auto bg-gradient-to-b from-slate-300 to-orange-100  relative">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-20 py-20">
        <div className="order-2 md:order-1 w-full relative md:w-1/2 flex flex-col gap-7">
          <img src="/hero-logo.png" className="w-full " alt="" />
          <div className="w-full  flex flex-col gap-9">
            <h1 className="text-5xl md:text-[5.5rem] text-center float-left leading-[1rem] font-medium text-[#4D83B9]">
              PLUS SIZE
            </h1>
            <h1 className="text-4xl w-fsull ml-auto pr-7 font-semibold text-[#005A9C]">
              Apparel Shop
            </h1>
          </div>
        </div>
        <div className="order-1 md:order-2 bg-[#F6EBEB80] border-r-4 border-b-4 border-neutral-400/50 rounded-lsmg p-8 w-full md:w-1/2">
          <p className="text-2xl font-bold text-primary mb-5 text-center">
            Inventory Management System Login
          </p>

          {loginMutation.isError && (
            <MessageError
              className="mb-5"
              message="Invalid Credentials, Please try again"
            />
          )}
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className=" text-sm text-[#005A9C] font-semibold flex items-center">
                <span className="text-red-500 text-2xl">*</span> Username
              </label>
              <input
                type="text"
                className=" w-full px-4 py-4 border border-primary/60 rounded-md text-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className=" text-sm text-[#005A9C] font-semibold flex items-center">
                <span className="text-red-500 text-2xl">*</span> Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className=" w-full px-4 py-4 border border-primary/60 rounded-md text-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Eye
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/50 text-white font-bold py-4 rounded-md"
            >
              {loginMutation.isPending ? "Loading" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}
