import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Title from "@/components/title/title";
import { addSaleApi } from "@/api/saleApi";
import { useGetCustomerList } from "@/hooks/useGetCustomer";
import { useGetProductList } from "@/hooks/useGetProduct";

type SalesItem = {
  product: string;
  totalQuantity: string;
  price: string;
  orderQuantity: string;
  totalPrice: string;
};

const AddNewSales = () => {
   const { data: customers = [] } = useGetCustomerList();
  const { data: products } = useGetProductList();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    orderDate: "",
    prevDue: "",
    paidAmount: "",
    paymentMethod: "Gcash",
  });

  const [items, setItems] = useState<SalesItem[]>([
    {
      product: "",
      totalQuantity: "",
      price: "",
      orderQuantity: "",
      totalPrice: "",
    },
  ]);

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name as keyof SalesItem] = value;

    const price = parseFloat(updatedItems[index].price || "0");
    const qty = parseFloat(updatedItems[index].orderQuantity || "0");
    updatedItems[index].totalPrice = (price * qty).toFixed(2);

    setItems(updatedItems);
  };

  const addNewItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product: "",
        totalQuantity: "",
        price: "",
        orderQuantity: "",
        totalPrice: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.totalPrice || "0"),
    0
  );

  const netTotal = subtotal + parseFloat(customerInfo.prevDue || "0");
  const dueAmount = netTotal - parseFloat(customerInfo.paidAmount || "0");

  const mutation = useMutation({
    mutationFn: addSaleApi,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Sale Added",
        text: "The sale entry was successfully added.",
      });
      navigate("/sales-entry");
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add sale. Please try again.",
      });
    },
  });

  const handleSubmit = () => {
    const payload = {
      invoice: Math.floor(10000 + Math.random() * 89999),
      customerId: Number(customerInfo?.customerName),
      orderDate: new Date(customerInfo.orderDate).toISOString(),
      netTotal: parseFloat(netTotal.toFixed(2)),
      paid: parseFloat(customerInfo.paidAmount || "0"),
      due: parseFloat(dueAmount.toFixed(2)),
      status:
        dueAmount === 0
          ? "Completed"
          : parseFloat(customerInfo.paidAmount || "0") === 0
          ? "Pending"
          : "Partial",
      paymentType: customerInfo.paymentMethod,
      updatedOn: new Date().toISOString(),
      saleItems: {
        create: items.map((item) => ({
          productId: item.product || "UNKNOWN",
          quantity: parseFloat(item.orderQuantity || "0"),
          price: parseFloat(item.price || "0"),
          total: parseFloat(item.totalPrice || "0"),
        })),
      },
    };
    

    mutation.mutate(payload);
  };

    console.log("customerInfo", customerInfo);
  
  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-6 pb-3">
        <Title
          title="Add New Sales"
          description="Insert new sales to the system."
        />
      </div>

      <div className="p-5 rounded space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#EFEFEF] p-3">
          <div>
            <label className="text-sm font-bold text-[#512E2E]">
              Customer Name
            </label>
            <select
              name="customerName"
              value={customerInfo?.customerName}
              onChange={handleCustomerChange}
              className="w-full border p-2 rounded bg-white"
            >
              <option value="">Select Customer</option>
              {customers?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-[#512E2E]">
              Order Date
            </label>
            <input
              type="date"
              name="orderDate"
              value={customerInfo.orderDate}
              onChange={handleCustomerChange}
              className="w-full border p-2 rounded bg-white"
            />
          </div>
        </div>

        <div className="bg-[#EFEFEF] p-3 space-y-4">
          {items?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center"
            >
              <div className="md:col-span-2">
                <label className="font-bold text-sm text-[#512E2E]">
                  Product
                </label>
                <select
                  name="product"
                  value={item.product}
                  onChange={(e) => handleItemChange(index, e)}
                  className="w-full border p-2 rounded border-gray-400 bg-white"
                >
                  <option value="">Select Product</option>
                  {products?.map((p:any) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand})
                    </option>
                  ))}
                </select>
              </div>
              <input
                name="totalQuantity"
                type="number"
                placeholder="Total Quantity"
                value={item.totalQuantity}
                onChange={(e) => handleItemChange(index, e)}
                className="border p-2 md:mt-6 rounded border-gray-400 bg-white"
              />
              <input
                name="price"
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                className="border p-2 md:mt-6 rounded border-gray-400 bg-white"
              />
              <input
                name="orderQuantity"
                type="number"
                placeholder="Order Qty"
                value={item.orderQuantity}
                onChange={(e) => handleItemChange(index, e)}
                className="border p-2 md:mt-6 rounded border-gray-400 bg-white"
              />
              <input
                readOnly
                value={item.totalPrice}
                className="border p-2 md:mt-6 rounded bg-white"
              />
              <div className="flex items-center justify-center pt-6">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800 text-xl"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addNewItem}
              className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
            >
              Add New Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#EFEFEF] p-3">
          <input
            readOnly
            value={subtotal.toFixed(2)}
            className="border p-2 rounded bg-white"
            placeholder="Subtotal"
          />
          <input
            name="prevDue"
            value={customerInfo.prevDue}
            onChange={handleCustomerChange}
            placeholder="Previous Due"
            className="border p-2 rounded border-gray-400 bg-white"
          />
          <input
            readOnly
            value={netTotal.toFixed(2)}
            className="border p-2 rounded bg-white"
            placeholder="Net Total"
          />
          <input
            name="paidAmount"
            value={customerInfo.paidAmount}
            onChange={handleCustomerChange}
            placeholder="Paid Amount"
            className="border p-2 rounded border-gray-400 bg-white"
          />
          <input
            readOnly
            value={dueAmount.toFixed(2)}
            className="border p-2 rounded bg-white"
            placeholder="Due Amount"
          />
          <select
            name="paymentMethod"
            value={customerInfo.paymentMethod}
            onChange={handleCustomerChange}
            className="border p-2 rounded border-gray-400 bg-white"
          >
            <option value="Gcash">Gcash</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
          >
            Add Sale
          </button>
          <Link
            to="/sales-entry"
            className="bg-[#F6726C] text-white px-12 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddNewSales;
