import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Title from "@/components/title/title";
import { addProductApi } from "@/api/productApi";

const AddNewProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    name: "",
    brand: "",
    size: "",
    category: "",
    quantity: "",
    buyingPrice: "",
    sellingPrice: "",
    source: "",
  });

  const addProductMutate = useMutation({
    mutationFn: addProductApi,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "The product was successfully added!",
      });
      navigate("/product-list");
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not add product. Please check the form.",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      quantity: parseInt(form.quantity),
      buyingPrice: parseFloat(form.buyingPrice),
      sellingPrice: parseFloat(form.sellingPrice),
    };
    addProductMutate.mutate(payload);
  };

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-9 pb-3">
        <Title
          title="Add New Product"
          description="Insert a new product to the system."
        />
      </div>

      <div className="bg-[#f3f3f3] p-5 rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Product ID"
            name="id"
            value={form.id}
            onChange={handleChange}
            required
          />
          <Field
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Field
            label="Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
          />
          <div>
            <label className="text-base text-[#512E2E] font-bold flex items-center">
              <span className="text-red-500 text-xl font-medium">*</span>Size
            </label>
            <select
              name="size"
              value={form.size}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded border-gray-400 bg-white"
            >
              <option value="">-- Select Size --</option>
              <option value="XS">Extra Small (XS)</option>
              <option value="S">Small (S)</option>
              <option value="M">Medium (M)</option>
              <option value="L">Large (L)</option>
              <option value="XL">Extra Large (XL)</option>
            </select>
          </div>

          <Field
            label="Quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            type="number"
            required
          />
          <Field
            label="Buying Price"
            name="buyingPrice"
            value={form.buyingPrice}
            onChange={handleChange}
            type="number"
            required
          />
          <Field
            label="Selling Price"
            name="sellingPrice"
            value={form.sellingPrice}
            onChange={handleChange}
            type="number"
            required
          />
          <Field
            label="Source"
            name="source"
            value={form.source}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
          >
            Add New Product
          </button>
          <Link
            to="/product-list"
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
  type = "string",
}: any) => (
  <div>
    <label className="text-base text-[#512E2E] font-bold flex items-center">
      {required && <span className="text-red-500 text-xl font-medium">*</span>}
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={required ? "(Required)" : "(Optional)"}
      className="w-full border p-2 rounded border-gray-400 bg-white"
    />
  </div>
);

export default AddNewProduct;
