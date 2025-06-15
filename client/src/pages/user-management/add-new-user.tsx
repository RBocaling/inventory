import { registerApi } from "@/api/authApi";
import Title from "@/components/title/title";
import { useGetInfo } from "@/hooks/useGetInfo";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddNewUser = () => {
  const navigate = useNavigate();
  const { data } = useGetInfo();

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    role: "",
    email: "",
    contact: "",
    address: "",
    idNumber: "",
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "User Added",
        text: "The user was successfully added!",
      });
      navigate("/user-management");
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not add user. Please try again.",
      });
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    registerMutation.mutate(form);
  };

  if (data.role !== "ADMIN") {
    navigate("/user-management");
  }
  if (data.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-9 pb-3">
        <Title
          title="Add New User"
          description="Insert a new user to the system."
        />
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
              placeholder="(Required)"
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
              placeholder="(Required)"
              className="w-full border p-2 rounded border-gray-400 bg-white"
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
              placeholder="(Required)"
              className="w-full border p-2 rounded border-gray-400 bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#512E2E]">
              <span className="text-red-500">* </span> Designation
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
              placeholder="Optional"
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
              placeholder="(Required)"
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
              placeholder="Optional"
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
              placeholder="Optional"
              className="w-full border p-2 rounded border-gray-400 bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
          >
            {registerMutation.isPending ? "Submiting.." : "  Add New Member"}
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

export default AddNewUser;
