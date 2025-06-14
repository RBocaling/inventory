import Title from "@/components/title/title";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { products } from "./product-data";
import { useGetProductByID } from "@/hooks/useGetProduct";
import { useMutation } from "@tanstack/react-query";
import { updateProductApi } from "@/api/productApi";
import Swal from "sweetalert2";

const UpdateProduct = () => {
  const { id } = useParams();
  if (!id) return null;
  const { data: product } = useGetProductByID(id);
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

  useEffect(() => {
    if (product) {
      setForm({
        id: product?.id,
        name: product?.name,
        brand: product?.brand,
        size: product?.size,
        category: product?.category || "",
        quantity: product?.quantity?.toString(),
        buyingPrice: product?.buyingPrice?.toString(),
        sellingPrice: product?.sellingPrice?.toString(),
        source: product?.source || "",
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateProductMutate = useMutation({
    mutationFn: updateProductApi,
    onSuccess: () => {
      
      Swal.fire({
        icon: "success",
        title: "Product Updated",
        text: "The product was successfully Updated!",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      brand: form.brand,
      size: form.size,
      category: form.category,
      quantity: parseInt(form.quantity),
      remainingStock: parseInt(form.quantity),
      buyingPrice: parseFloat(form.buyingPrice),
      sellingPrice: parseFloat(form.sellingPrice),
      source: form.source,
      isLowStock: parseInt(form.quantity) <= 10,
      isDeleted: false,
    };

    updateProductMutate.mutate({ id: form.id, ...payload });
  };

  
    console.log("productToUpdate", product);
    
  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-9 pb-3">
        <Title
          title="Edit Product"
          description="Allows you to modify product information."
        />
      </div>

      <div className="bg-[#f3f3f3] p-5 rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#512E2E]">
              <span className="text-red-500">* </span>Product ID
            </label>
            <input
              name="id"
              value={form.id}
              readOnly
              onChange={handleChange}
              className="w-full border border-gray-400 bg-white p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#512E2E]">
              <span className="text-red-500">* </span>Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-400 bg-white p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#512E2E]">
              <span className="text-red-500">* </span>Brand
            </label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full border border-gray-400 bg-white p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#512E2E]">
              <span className="text-red-500">* </span>Size
            </label>
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              className="w-full border border-gray-400 bg-white p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#512E2E]">
              <span className="text-red-500">* </span>Quantity
            </label>
            <input
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border border-gray-400 bg-white p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#512E2E]">
              <span className="text-red-500">* </span>Buying Price
            </label>
            <input
              name="buyingPrice"
              value={form.buyingPrice}
              onChange={handleChange}
              className="w-full border border-gray-400 bg-white p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#512E2E]">
              <span className="text-red-500">* </span>Selling Price
            </label>
            <input
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
              className="w-full border border-gray-400 bg-white p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#512E2E]">
              Source
            </label>
            <input
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="(Optional)"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
          >
            Update
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

export default UpdateProduct;
