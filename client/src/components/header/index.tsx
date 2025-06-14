
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Swal from "sweetalert2";
import { useSidebarStore } from "@/store/sidebarStore";
import {useGetInfo, useGetUserList} from "@/hooks/useGetInfo";



export default function Header() {
  const { toggleSidebar } = useSidebarStore();
  const { clearTokens } = useAuthStore();
  const { data } = useGetInfo();
  const naviagte = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "Confirm Logout",
      text: "You are about to log out. Do you wish to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        clearTokens();
        naviagte("/login");
      }
    });
  };

  console.log("data", data);
  
  return (
    <header className="w-full p-3 relative z-50">
      <div className="flex items-center justify-between bg-[#fcf6f0] border border-neutral-100 px-6 py-3 shadow-md shadow-gray-300 rounded-md w-full">
        <button onClick={toggleSidebar}>
          <FiMenu size={30} className="text-[#7C5650]" />
        </button>

        <div className="flex items-center gap-4">
          <button>
            <img src="/icons/book.png" className="w-12" alt="" />
          </button>

          <p className="text-xl font-bold capitalize">{data?.name ?? ""}</p>
          <button
            onClick={handleLogout}
            className="text-white tracking-wide py-3 px-9 rounded-md bg-[#7C5650]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
