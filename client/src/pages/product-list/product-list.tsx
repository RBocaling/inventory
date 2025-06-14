import Title from "@/components/title/title";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { PiNotePencilBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetProductList } from "@/hooks/useGetProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductApi } from "@/api/productApi";
import { formatPHP } from "@/lib/constants";

const ProductList = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const { data: product } = useGetProductList();
  const queryClient = useQueryClient();

  const updateProductMutate = useMutation({
    mutationFn: updateProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-product-list"] });
      queryClient.invalidateQueries({ queryKey: ["get-product-by-id"] });
      Swal.fire({
        icon: "success",
        title: "Product Updated",
        text: "The product was successfully updated!",
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not update product. Please check the form.",
      });
    },
  });

  const handleDelete = (productId: string) => {
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
        updateProductMutate.mutate({ id: productId, isDeleted: true });
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

  const filteredProducts = product?.filter((p: any) => {
    const term = searchTerm.toLowerCase();
    return (
      p?.id.toLowerCase().includes(term) ||
      p?.name.toLowerCase().includes(term) ||
      p?.brand.toLowerCase().includes(term) ||
      p?.category.toLowerCase().includes(term) ||
      p?.source.toLowerCase().includes(term)
    );
  });

  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
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

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-5 pb-3">
        <Title
          title="Product List"
          description="View, insert or modify the product information list. Note that red entry means the product is low in stock."
        />
      </div>

      <div className="rounded shadow-sm bg-[#ece6e6]">
        <div className="p-4">
          <div className="bg-white rounded overflow-hidden p-3 overflow-x-auto">
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

            <table className="w-full text-sm bg-white">
              <thead className="text-[#512E2E] font-semibold">
                <tr>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    Product ID{renderSortArrow("id")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Product Name{renderSortArrow("name")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("brand")}
                  >
                    Brand{renderSortArrow("brand")}
                  </th>
                  <th className="text-left px-3 py-2">Size</th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    Category{renderSortArrow("category")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity{renderSortArrow("quantity")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("remainingStock")}
                  >
                    Remaining Stock{renderSortArrow("remainingStock")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("buyingPrice")}
                  >
                    Buying Price{renderSortArrow("buyingPrice")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("sellingPrice")}
                  >
                    Selling Price{renderSortArrow("sellingPrice")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("source")}
                  >
                    Source{renderSortArrow("source")}
                  </th>
                  <th className="text-left px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts
                  ?.slice(0, entriesToShow)
                  ?.map((product: any) => (
                    <tr key={product.id} className="border-t">
                      <td
                        className={`text-base px-3 py-2 ${
                          product.remainingStock <= 10
                            ? "text-red-600 font-bold"
                            : ""
                        }`}
                      >
                        {product.id}
                      </td>
                      <td
                        className={`text-base px-3 py-2 ${
                          product.remainingStock <= 10
                            ? "text-red-600 font-bold"
                            : ""
                        }`}
                      >
                        {product.name}
                      </td>
                      <td className="text-base px-3 py-2">{product.brand}</td>
                      <td className="text-base px-3 py-2">{product.size}</td>
                      <td className="text-base px-3 py-2">
                        {product.category}
                      </td>
                      <td className="text-base px-3 py-2">
                        {product.quantity}
                      </td>
                      <td className="text-base px-3 py-2">
                        {product.remainingStock}
                      </td>
                      <td className="text-base px-3 py-2">
                        {formatPHP(Number(product.buyingPrice.toFixed(2)))}
                      </td>
                      <td className="text-base px-3 py-2">
                         {formatPHP(Number(product.sellingPrice.toFixed(2)))}
                      </td>
                      <td className="text-base px-3 py-2">{product.source}</td>
                      <td className="px-3 py-2 flex items-center space-x-4">
                        <Link
                          to={`/product-list/update-product/${product.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PiNotePencilBold size={20} />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(product.id)}
                        >
                          <FaTrashCan size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {sortedProducts?.length === 0 && (
              <p className="text-center py-6 text-gray-500 text-sm">
                No products found.
              </p>
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

        <Link
          to="/product-list/add-new-product"
          className="bg-[#6b4b47] text-white px-4 py-2 rounded hover:bg-[#593b37]"
        >
          Add New Product
        </Link>
      </div>
    </div>
  );
};

export default ProductList;
