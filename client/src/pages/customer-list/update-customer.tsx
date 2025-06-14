import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetCustomerByID } from "@/hooks/useGetCustomer";
import { useMutation } from "@tanstack/react-query";
import { updateCustomerApi } from "@/api/customerApi";
import Swal from "sweetalert2";
import Title from "@/components/title/title";

const UpdateCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer } = useGetCustomerByID(Number(id));

  const [form, setForm] = useState({
    name: "",
    company: "",
    address: "",
    contact: "",
    isDeleted: false,
  });

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name,
        company: customer.company,
        address: customer.address,
        contact: customer.contact,
        isDeleted: false,
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateCustomerMutate = useMutation({
    mutationFn: updateCustomerApi,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Customer Updated",
        text: "The customer was successfully updated!",
      }).then(() => navigate("/customer-list"));
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not update customer. Please check the form.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerMutate.mutate({ id: Number(id), ...form });
  };

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-9 pb-3">
        <Title
          title="Update Customer"
          description={`Editing information for Customer ID: ${id}`}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-[#F3F4F6] p-5 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base text-[#512E2E] font-bold">
                <span className="text-red-500">* </span>Name
              </label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-400 bg-white p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-base text-[#512E2E] font-bold">
                <span className="text-red-500">* </span>Company
              </label>
              <input
                name="company"
                required
                value={form.company}
                onChange={handleChange}
                className="w-full border border-gray-400 bg-white p-2 rounded"
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
                className="w-full border border-gray-400 bg-white p-2 rounded"
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
                className="w-full border border-gray-400 bg-white p-2 rounded"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
              disabled={updateCustomerMutate.isPending}
            >
              {updateCustomerMutate.isPending
                ? "Updating..."
                : "Update Customer"}
            </button>
            <Link
              to="/customer-list"
              className="bg-[#F6726C] text-white px-12 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateCustomer;
