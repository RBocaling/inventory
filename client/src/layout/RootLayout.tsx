import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import useUserAuth from "@/hooks/useUserAuth";
import Footer from "@/components/footer";
import Loader from "@/components/loader/Loader";

const RootLayout = () => {
  const navigate = useNavigate();
  const { data, isAuthenticated, isLoading } = useUserAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <Loader/>;
  }
  
  if (!isAuthenticated) return null;
  
  return (
    <div className="flex items-start w-full relative h-screen overflow-auto">
      <Sidebar />
      <main className="relative main h-screen flex flex-col items-center gap-5 w-full bg-white min-h-screen overflow-y-auto">
        <Header />
        <Outlet />
      </main>
      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default RootLayout;
