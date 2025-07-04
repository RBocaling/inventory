import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Title from "@/components/title/title";
import { addSaleApi } from "@/api/saleApi";
import { useGetCustomerList } from "@/hooks/useGetCustomer";
import { useGetProductList } from "@/hooks/useGetProduct";
import { formatPHP } from "@/lib/constants";
import { format } from "date-fns";

type SalesItem = {
  product: string;
  totalQuantity: string;
  price: string;
  orderQuantity: string;
  totalPrice: string;
};
const AddNewSales = () => {
  const { data: customers = [] } = useGetCustomerList();
  const { data: products = [] } = useGetProductList();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    orderDate: format(new Date(), "yyyy-dd-MM"),
    prevDue: "",
    paidAmount: "",
    paymentMethod: "Gcash",
    referenceNumber: "",
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

  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  const handleCustomerChange = (selected: any) => {
    setCustomerInfo((prev) => ({
      ...prev,
      customerName: selected?.value || "",
    }));
  };

  const handleCustomerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (selected: any, index: number) => {
    const selectedProduct = products.find((p: any) => p.id === selected?.value);
    const updatedItems = [...items];

    updatedItems[index] = {
      product: selected?.value || "",
      totalQuantity: selectedProduct?.remainingStock?.toString() || "0",
      price: selectedProduct?.sellingPrice?.toString() || "0",
      orderQuantity: "",
      totalPrice: "",
    };

    setItems(updatedItems);
    setErrors((prev) => ({ ...prev, [index]: "" }));
  };

  const handleOrderQtyChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const updatedItems = [...items];
    const maxStock = parseFloat(updatedItems[index].totalQuantity || "0");
    const qty = parseFloat(value || "0");

    if (qty > maxStock) {
      setErrors((prev) => ({
        ...prev,
        [index]: `Only ${maxStock} in stock.`,
      }));
      updatedItems[index].orderQuantity = value;
      updatedItems[index].totalPrice = "0";
    } else {
      setErrors((prev) => ({ ...prev, [index]: "" }));
      updatedItems[index].orderQuantity = value;
      updatedItems[index].totalPrice = (
        parseFloat(updatedItems[index].price || "0") * qty
      ).toFixed(2);
    }

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
        referenceNumber: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr[index];
      return newErr;
    });
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
    // Prevent submission if any errors exist
    if (Object.values(errors).some((e) => e)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Quantity",
        text: "Check order quantity vs. stock.",
      });
      return;
    }

    const payload = {
      invoice: Math.floor(10000 + Math.random() * 89999),
      customerId: Number(customerInfo.customerName),
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
      referenceNumber: customerInfo.referenceNumber,
      updatedOn: new Date().toISOString(),
      saleItems: {
        create: items.map((item) => ({
          productId: item.product,
          quantity: parseFloat(item.orderQuantity || "0"),
          price: parseFloat(item.price || "0"),
          total: parseFloat(item.totalPrice || "0"),
        })),
      },
    };

    mutation.mutate(payload);
  };

  const customerOptions = customers.map((c: any) => ({
    label: `${c.name} (${c.company})`,
    value: c.id,
  }));

  const productOptions = products?.map((p: any) => ({
    label: `${p.name} (${p.brand})`,
    value: p.id,
  }));

  const selectRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    (inputRef.current as any)?.focus();
  }, []);

  useEffect(() => {
    if (selectRef.current) {
      (selectRef.current as any).focus();
    }
  }, []);

  console.log(
    "customerInfo",
    items?.filter((item) => item?.orderQuantity == "")?.length
  );

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-6 pb-3">
        <Title
          title="Add New Sales"
          description="Insert new sales to the system."
        />
      </div>

      <div className="p-5 rounded space-y-4">
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#EFEFEF] p-3">
          <div>
            <p className="text-sm font-bold text-[#512E2E] mb-1">
              Customer Name
            </p>
            <Select
              ref={selectRef}
              options={customerOptions}
              onChange={handleCustomerChange}
              placeholder="Select Customer"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-[#512E2E] mb-1">Order Date</p>
            <div className="relative bg-red-500">
              <input
                type="date"
                name="orderDate"
                value={customerInfo.orderDate}
                onChange={handleCustomerInput}
                className="w-full border p-2 rounded bg-white"
              />
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-[#EFEFEF] p-3 space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center"
            >
              <div className="md:col-span-2">
                <p className="font-bold text-sm text-[#512E2E]">Product</p>
                <Select
                  options={productOptions}
                  onChange={(selected) => handleProductChange(selected, index)}
                  placeholder="Select Product"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-[#512E2E]">Stock</p>
                <input
                  readOnly
                  value={item.totalQuantity}
                  className="border p-2 rounded bg-gray-100"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-[#512E2E]">Price</p>
                <input
                  readOnly
                  value={formatPHP(Number(item.price))}
                  className="border p-2 rounded bg-gray-100"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-[#512E2E]">Order Qty</p>
                <input
                  type="number"
                  value={item.orderQuantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) >= 1) {
                      handleOrderQtyChange(index, e);
                    }
                  }}
                  className="border p-2 rounded bg-white w-full"
                  ref={inputRef}
                  min="1"
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key.toLowerCase() === "e") {
                      e.preventDefault();
                    }
                    const input = e.currentTarget;
                    const currentValue = input.value;

                    if (e.key === "0" && currentValue === "") {
                      e.preventDefault();
                    }
                  }}
                />
                {errors[index] && (
                  <p className="text-xs text-red-600 mt-1">{errors[index]}</p>
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-[#512E2E]">Total</p>
                <input
                  readOnly
                  value={formatPHP(Number(item.totalPrice))}
                  className="border p-2 rounded bg-gray-100"
                />
              </div>
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
              disabled={items[items.length - 1]?.orderQuantity === ""}
              className={`${
                items[items.length - 1]?.orderQuantity === ""
                  ? "bg-[#6b4b47]"
                  : "bg-[#6b4b47]"
              }  text-white px-6 py-2 rounded hover:bg-[#593b37]`}
            >
              Add New Item
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#EFEFEF] p-3">
          <div className="w-full">
            <p className="font-bold text-sm text-[#512E2E]">Subtotal</p>
            <input
              readOnly
              value={formatPHP(subtotal)}
              className="border p-2 rounded bg-gray-100 w-full"
            />
          </div>
          <div className="w-full">
            <p className="font-bold text-sm text-[#512E2E]">Previous Due</p>
            <input
              type="number"
              name="prevDue"
              value={customerInfo.prevDue}
              onChange={handleCustomerInput}
              className="border p-2 rounded bg-white w-full"
              min="0"
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div className="w-full">
            <p className="font-bold text-sm text-[#512E2E]">Net Total</p>
            <input
              readOnly
              value={formatPHP(netTotal)}
              className="border p-2 rounded bg-gray-100 w-full"
            />
          </div>
          <div className="w-full">
            <p className="font-bold text-sm text-[#512E2E]">Paid Amount</p>
            <input
              type="number"
              name="paidAmount"
              value={customerInfo.paidAmount}
              onChange={handleCustomerInput}
              className="border p-2 rounded bg-white w-full"
              min="0"
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div className="w-full">
            <p className="font-bold text-sm text-[#512E2E]">Due Amount</p>
            <input
              readOnly
              value={formatPHP(dueAmount)}
              className="border p-2 rounded bg-gray-100 w-full"
            />
          </div>
          <div className="w-full">
            <p className="font-bold text-sm text-[#512E2E]">Payment Method</p>
            <select
              name="paymentMethod"
              value={customerInfo.paymentMethod}
              onChange={handleCustomerInput}
              className="border p-2 rounded bg-white w-full"
            >
              <option value="Gcash">Gcash</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div className="w-full">
            <p className="font-bold text-sm text-[#512E2E]">Reference Number</p>
            <input
              name="referenceNumber"
              value={customerInfo.referenceNumber ?? ""}
              className="border p-2 rounded bg-white w-full"
              onChange={handleCustomerInput}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <div>
            <button
              disabled={
                items?.filter((item) => item?.orderQuantity == "")?.length > 0
              }
              type="button"
              onClick={handleSubmit}
              className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
            >
              Add Sale
            </button>
            {items?.filter((item) => item?.orderQuantity == "")?.length > 0 && (
              <p className="text-red-500 text-sm font-medium">
                Please Input empty order Qty.
              </p>
            )}
          </div>

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
