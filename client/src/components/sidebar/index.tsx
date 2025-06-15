  import {
    CalendarCheck2,
    Users,
    AppWindow,
} from "lucide-react";
import { FaHome } from "react-icons/fa";
  import { cn } from "@/lib/utils";
  import { Link, useLocation } from "react-router-dom";
import { useSidebarStore } from "@/store/sidebarStore";
import { useGetInfo } from "@/hooks/useGetInfo";

export default function Sidebar() {
  const { data } = useGetInfo();

  const menuItems = [
    { label: "Dashboard", icon: FaHome, url: "/" },
    { label: "Product List", icon: CalendarCheck2, url: "/product-list" },
    { label: "Customer List", icon: Users, url: "/customer-list" },
    { label: "Sales Entry", icon: AppWindow, url: "/sales-entry" },
    { label: "Reports", icon: AppWindow, url: "/reports" },
    {
      label: "User Management",
      icon: AppWindow,
      url: "/user-management",
      isHide: data?.role === "EMPLOYEE",
    },
  ];
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar, setSidebar } = useSidebarStore();

  const currentPath = location.pathname;

  console.log("currentPath", data?.role === "EMPLOYEE");

  return (
    <aside
      className={`${
        !isSidebarOpen
          ? "hidden md:flex"
          : "fixed top-0 left-0 w-full z-[999] md:relative"
      } w-96 h-screen bg-[#7C5650] py-5 shadow flex flex-col justify-between overflow-y-auto`}
    >
      <div>
        <div className="px-5 mb-20">
          <button
            onClick={toggleSidebar}
            className="text-3xl pb-5 text-right w-full text-white font-semibold  md:hidden"
          >
            &times;
          </button>
          <div className="flex items-center justify-center gap-2 mb-8 bg-white p-3 rounded-sm">
            <img src="/hero-logo.png" alt="Logo" className="w-[45%]" />
            <p className="text-base text-primary font-semibold w-[55%] flex flex-col">
              Inventory <span className="text-lg font-bold">Management</span>
              System
            </p>
          </div>
        </div>

        <ul className=" space-y-2">
          {menuItems.map(({ label, icon: Icon, url, isHide }) => (
            <li key={label} className={`${isHide && "hidden"}`}>
              <Link
                to={url}
                onClick={() => setSidebar(false)}
                className={cn(
                  ` w-full flex items-center gap-3 px-5 py-3 tracking-wider`,
                  currentPath === url
                    ? "text-white bg-[#512E2E] mb-3"
                    : "text-white/80 hover:text-white hover:bg-[#472929]"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center text-xs text-gray-500">
        <p>Tourista App Admin Dashboard</p>
        <p>© 2025 All Rights Reserved</p>
      </div>
    </aside>
  );
}
  