import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Title from "@/components/title/title";
import { addCustomerApi } from "@/api/customerApi"; // You must create this API

const AddNewCustomer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    company: "",
    address: "",
    contact: "",
    // totalSales: 0,
    // totalPaid: 0,
    // totalDue: 0,
  });

  const mutation = useMutation({
    mutationFn: addCustomerApi,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Customer Added",
        text: "The customer was successfully added!",
      });
      navigate("/customer-list");

    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not add customer. Please try again.",
      });
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name.includes("total") ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    mutation.mutate({
      ...form,
      updatedOn: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-9 pb-3">
        <Title
          title="Add New Customer"
          description="Insert a new customer to the system."
        />
      </div>

      <div className="bg-[#F3F4F6] p-5 rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Field
            label="Company"
            name="company"
            value={form.company}
            onChange={handleChange}
            required
          />
          <Field
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <Field
            label="Contact Number"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            required
            type="number"
          />
          {/* <Field
            label="Total Sales"
            name="totalSales"
            type="number"
            value={form.totalSales}
            onChange={handleChange}
          />
          <Field
            label="Total Paid"
            name="totalPaid"
            type="number"
            value={form.totalPaid}
            onChange={handleChange}
          />
          <Field
            label="Total Due"
            name="totalDue"
            type="number"
            value={form.totalDue}
            onChange={handleChange}
          /> */}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
          >
            Add Customer
          </button>
          <Link
            to="/customer-list"
            className="bg-[#F6726C] text-white px-12 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
}: any) => (
  <div>
    <label className="block text-base text-[#512E2E] font-bold">
      {required && <span className="text-red-500">* </span>}
      {label}
    </label>
    <input
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={required ? "(Required)" : "(Optional)"}
      className="w-full border p-2 rounded border-gray-400 bg-white"
    />
  </div>
);

export default AddNewCustomer;
