import Title from "@/components/title/title";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { PiNotePencilBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetInfo, useGetUserList } from "@/hooks/useGetInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserApi } from "@/api/authApi";

const UserManagement = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const queryClient = useQueryClient();
  const { data } = useGetInfo();

  const { data: users, isLoading } = useGetUserList();

  const updateUserMutate = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "User successfully deleted.",
        icon: "success",
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["get-user-list"] });
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not update user. Please check the form.",
      });
    },
  });

  const handleDelete = (userId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserMutate.mutate({ id: Number(userId), isDeleted: true });
      }
    });
  };

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  const filteredUsers = users?.filter((user: any) => {
    const term = searchTerm.toLowerCase();
    return (
      user?.name?.toLowerCase().includes(term) ||
      user?.email?.toLowerCase().includes(term) ||
      user?.role?.toLowerCase().includes(term) ||
      user?.contact?.toLowerCase().includes(term) ||
      user?.address?.toLowerCase().includes(term) ||
      user?.username?.toLowerCase().includes(term)
    );
  });

  const sortedUsers = [...(filteredUsers || [])].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (typeof aVal === "string") {
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    }
  });

  if (data?.role === "EMPLOYEE") {
    return null;
  }
  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-5 pb-3">
        <Title
          title="User Management"
          description="Allows you to manage the users of the system."
        />
      </div>

      <div className="rounded shadow-sm bg-[#ece6e6]">
        <div className="p-4">
          <div className="bg-white rounded overflow-x-auto p-3">
            <div className="flex items-center rounded-md justify-between bg-[#f1eded] pl-4 mb-4">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
              <button className="ml-2 p-3 bg-[#6b4b47] text-white rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>

            {isLoading ? (
              <p className="text-center py-4">Loading users...</p>
            ) : (
              <table className="w-full text-sm bg-white">
                <thead className="text-[#512E2E] font-semibold">
                  <tr>
                    <th className="text-left px-3 py-2">#</th>
                    <th
                      className="text-left px-3 py-2 cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      ID Number{renderSortArrow("id")}
                    </th>
                    <th
                      className="text-left px-3 py-2 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Name{renderSortArrow("name")}
                    </th>
                    <th
                      className="text-left px-3 py-2 cursor-pointer"
                      onClick={() => handleSort("role")}
                    >
                      Designation{renderSortArrow("role")}
                    </th>
                    <th
                      className="text-left px-3 py-2 cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      Email{renderSortArrow("email")}
                    </th>
                    <th
                      className="text-left px-3 py-2 cursor-pointer"
                      onClick={() => handleSort("contact")}
                    >
                      Contact{renderSortArrow("contact")}
                    </th>
                    <th
                      className="text-left px-3 py-2 cursor-pointer"
                      onClick={() => handleSort("address")}
                    >
                      Address{renderSortArrow("address")}
                    </th>
                    {data?.role === "ADMIN" && (
                      <th className="text-left px-3 py-2">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers
                    ?.slice(0, entriesToShow)
                    .map((user: any, index: number) => (
                      <tr key={user?.id} className="border-t">
                        <td className="text-base px-3 py-2">{index + 1}</td>
                        <td className="text-base px-3 py-2">{`U-${user?.id}`}</td>
                        <td className="text-base px-3 py-2">{user?.name}</td>
                        <td className="text-base px-3 py-2">{user?.role}</td>
                        <td className="text-base px-3 py-2">{user?.email}</td>
                        <td className="text-base px-3 py-2">{user?.contact}</td>
                        <td className="text-base px-3 py-2">{user?.address}</td>
                        {data?.role === "ADMIN" && (
                          <td className="px-3 py-2 flex items-center space-x-4">
                            <Link
                              to={`/user-management/update-user/${user.id}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PiNotePencilBold size={20} />
                            </Link>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDelete(user.id)}
                            >
                              <FaTrashCan size={20} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-sm text-gray-900 font-bold">
          Show{" "}
          <select
            className="border rounded px-2 py-1"
            value={entriesToShow}
            onChange={(e) => setEntriesToShow(parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>{" "}
          entries
        </div>

        {data?.role === "ADMIN" && (
          <Link
            to="/user-management/add-new-user"
            className="bg-[#6b4b47] text-white px-4 py-2 rounded hover:bg-[#593b37]"
          >
            Add New User
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
