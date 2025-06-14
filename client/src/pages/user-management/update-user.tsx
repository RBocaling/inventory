import Title from "@/components/title/title";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { users } from "./components/mockUser";
import useGetUserById from "@/hooks/useGetUserById";
import { useMutation } from "@tanstack/react-query";
import { updateUserApi } from "@/api/authApi";
import Swal from "sweetalert2";

const UpdateUser = () => {
  const { id } = useParams();
const { data: userInfo } = useGetUserById(Number(id));
const navigate = useNavigate();

  console.log("userInfo", userInfo);
  
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    role: "",
    email: "",
    contact: "",
    address: "",
    idNumber: "",
    isDeleted: false,
  });
 

  useEffect(() => {
    if (userInfo) {
      setForm({
        username: userInfo.name.toLowerCase().replace(/\s+/g, ""),
        password: "",
        name: userInfo.name,
        role: userInfo.role,
        email: userInfo.email,
        contact: userInfo.contact,
        address: userInfo.address,
        idNumber: userInfo.idNumber || "",
        isDeleted:false,
      });
    }
  }, [userInfo]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const updateUserMutate = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "User Updated",
        text: "The User was successfully updated!",
      }).then(() => navigate("/user-management"));
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not update User. Please check the form.",
      });
    },
  });

  const handleSubmit = () => {
    updateUserMutate.mutate({ id: Number(id), ...form });
  }
  

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-9 pb-3">
        <Title title="Update User" description={`Editing information`} />
      </div>

      <div className="bg-[#F3F4F6] p-5 rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-base text-[#512E2E] font-bold">
              <span className="text-red-500">* </span>Full Name
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-400 bg-white"
            />
          </div>

          <div>
            <label className="block text-base text-[#512E2E] font-bold">
              <span className="text-red-500">* </span>Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-400 bg-white"
              placeholder="(Leave blank to keep current)"
            />
          </div>
          <div>
            <label className="block text-base text-[#512E2E] font-bold">
              <span className="text-red-500">* </span>Username
            </label>
            <input
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-400 bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#512E2E]">
              <span className="text-red-500">* </span>Designation
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-primary/60 rounded-md text-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold">
              <span className="text-red-500">* </span>Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-base text-[#512E2E] font-bold">
              <span className="text-red-500">* </span>Contact Number
            </label>
            <input
              name="contact"
              required
              value={form.contact}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-base text-[#512E2E] font-bold">
              <span className="text-red-500">* </span>Address
            </label>
            <input
              name="address"
              required
              value={form.address}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">
              <span className="text-red-500">* </span>ID Number
            </label>
            <input
              name="idNumber"
              value={form.idNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-400 bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
          >
            {updateUserMutate.isPending ? "Updating.." : "Update Member"}
          </button>
          <Link
            to="/user-management"
            className="bg-[#F6726C] text-white px-12 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
