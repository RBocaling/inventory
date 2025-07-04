import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Title from "@/components/title/title";
import { updateSaleApi } from "@/api/saleApi";
import { useGetCustomerList } from "@/hooks/useGetCustomer";
import { useGetProductList } from "@/hooks/useGetProduct";
import { useGetSaleById } from "@/hooks/useGetSale";
import { formatPHP } from "@/lib/constants";

type SalesItem = {
  product: string;
  totalQuantity: string;
  price: string;
  orderQuantity: string;
  totalPrice: string;
};

const UpdateSales = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sale } = useGetSaleById(Number(id));
  const { data: customers = [] } = useGetCustomerList();
  const { data: products = [] } = useGetProductList();

  const [customerInfo, setCustomerInfo] = useState({
    customerId: "",
    orderDate: "",
    prevDue: "",
    paid: "",
    paymentMethod: "Gcash",
    referenceNumber: "",
  });

  const [items, setItems] = useState<SalesItem[]>([]);
  const [errors, setErrors] = useState<{ [index: number]: string }>({});

  useEffect(() => {
    if (!sale) return;

    setCustomerInfo({
      customerId: sale.customerId.toString(),
      orderDate: sale.orderDate.slice(0, 10),
      prevDue: (sale.netTotal - sale.paid).toString(),
      paid: sale.paid.toString(),
      paymentMethod: sale.paymentType,
      referenceNumber: sale.referenceNumber,
    });

    setItems(
      sale.saleItems.map((item: any) => ({
        product: item.productId,
        totalQuantity: item.quantity,
        price: item.price.toString(),
        orderQuantity: item.quantity.toString(),
        totalPrice: item.total.toFixed(2),
      }))
    );
  }, [sale]);

  const customerOptions = customers.map((c: any) => ({
    value: c.id.toString(),
    label: `${c.name} (${c.company})`,
  }));

  const productOptions = products.map((p: any) => ({
    value: p.id,
    label: `${p.name} (${p.brand})`,
  }));

  const handleCustomerChange = (selected: any) => {
    setCustomerInfo((prev) => ({
      ...prev,
      customerId: selected?.value || "",
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
      orderQuantity: updatedItems[index].orderQuantity,
      totalPrice: (
        parseFloat(updatedItems[index].orderQuantity || "0") *
        parseFloat(selectedProduct?.sellingPrice || "0")
      ).toFixed(2),
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
  const dueAmount = netTotal - parseFloat(customerInfo.paid || "0");

  const mutation = useMutation({
    mutationFn: updateSaleApi,
    onSuccess: () => {
      Swal.fire("Success", "Sale updated successfully", "success").then(() =>
        navigate("/sales-entry")
      );
    },
    onError: () => {
      Swal.fire("Error", "Failed to update sale", "error");
    },
  });

  const handleSubmit = () => {
    if (Object.values(errors).some((e) => e)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Quantity",
        text: "Check order quantity vs. stock.",
      });
      return;
    }

    mutation.mutate({
      id: Number(id),
      data: {
        invoice: sale?.invoice,
        customerId: Number(customerInfo.customerId),
        orderDate: new Date(customerInfo.orderDate).toISOString(),
        netTotal: parseFloat(netTotal.toFixed(2)),
        paid: parseFloat(customerInfo.paid || "0"),
        due: parseFloat(dueAmount.toFixed(2)),
        status:
          dueAmount === 0
            ? "Completed"
            : parseFloat(customerInfo.paid || "0") === 0
            ? "Pending"
            : "Partial",
        paymentType: customerInfo.paymentMethod,
        referenceNumber: customerInfo.referenceNumber,
        updatedOn: new Date().toISOString(),
        saleItems: {
          deleteMany: {},
          create: items.map((item) => ({
            productId: item.product,
            quantity: parseFloat(item.orderQuantity || "0"),
            price: parseFloat(item.price || "0"),
            total: parseFloat(item.totalPrice || "0"),
          })),
        },
      },
    });
  };

  const inputRef = useRef(null);
  useEffect(() => {
    (inputRef.current as any)?.focus();
  }, []);

  console.log(
    "ddd",
    items?.filter((item) => item?.orderQuantity == "")?.length
  );

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-6 pb-3">
        <Title
          title="Update Sale"
          description={`Update sales entry for invoice #${sale?.invoice}`}
        />
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#EFEFEF] p-3 mb-4">
        <div className="w-full flex flex-col">
          <p className="text-sm font-bold text-[#512E2E] mb-1">Customer Name</p>
          <Select
            options={customerOptions}
            value={customerOptions.find(
              (opt: any) => opt.value === customerInfo.customerId
            )}
            onChange={handleCustomerChange}
            placeholder="Select Customer"
          />
        </div>
        <div className="w-full flex flex-col">
          <p className="text-sm font-bold text-[#512E2E] mb-1">Order Date</p>
          <input
            type="date"
            name="orderDate"
            value={customerInfo.orderDate}
            onChange={handleCustomerInput}
            className="w-full border p-2 rounded bg-white"
          />
        </div>
      </div>

      {/* Product Items */}
      <div className="bg-[#EFEFEF] p-3 mb-4 space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center"
          >
            <div className="md:col-span-2">
              <p className="font-bold text-sm text-[#512E2E]">Product</p>
              <Select
                options={productOptions}
                value={productOptions.find(
                  (opt: any) => opt.value === item.product
                )}
                onChange={(selected) => handleProductChange(selected, index)}
                placeholder="Select Product"
              />
            </div>
            <div className="w-full flex flex-col">
              <p className="font-bold text-sm text-[#512E2E]">
                Remaining Stocks
              </p>
              <input
                readOnly
                value={item.totalQuantity}
                className="border p-2 rounded bg-gray-100"
                placeholder="Stock"
              />
            </div>
            <div className="w-full flex flex-col">
              <p className="font-bold text-sm text-[#512E2E]">Price</p>
              <input
                readOnly
                value={formatPHP(Number(item.price))}
                className="border p-2 rounded bg-gray-100"
                placeholder="Price"
              />
            </div>
            <div className="w-full flex flex-col">
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
            </div>
            <div className="w-full flex flex-col">
              <p className="font-bold text-sm text-[#512E2E]">Total</p>

              <input
                readOnly
                value={formatPHP(Number(item.totalPrice))}
                className="border p-2 rounded bg-gray-100"
                placeholder="Total"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 text-xl"
              >
                <FaTimes />
              </button>
            </div>
            {errors[index] && (
              <p className="text-xs text-red-500 col-span-7">{errors[index]}</p>
            )}
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={addNewItem}
            disabled={
              items[items.length - 1]?.orderQuantity == "0" ||
              items[items.length - 1]?.orderQuantity == null ||
              items[items.length - 1]?.orderQuantity == ""
            }
            className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
          >
            Add New Item
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#EFEFEF] p-3">
        <div className="w-full flex flex-col">
          <p className="font-bold text-sm text-[#512E2E]">Subtotal</p>
          <input
            readOnly
            value={formatPHP(Number(subtotal))}
            className="border p-2 rounded bg-gray-100"
            placeholder="Subtotal"
          />
        </div>
        <div className="w-full flex flex-col">
          <p className="font-bold text-sm text-[#512E2E]">Previous Due</p>
          <input
            name="prevDue"
            value={customerInfo.prevDue}
            onChange={handleCustomerInput}
            className="border p-2 rounded bg-white"
            placeholder="Previous Due"
          />
        </div>
        <div className="w-full flex flex-col">
          <p className="font-bold text-sm text-[#512E2E]">Net Total</p>
          <input
            readOnly
            value={formatPHP(Number(netTotal))}
            className="border p-2 rounded bg-gray-100"
            placeholder="Net Total"
          />
        </div>
        <div className="w-full flex flex-col">
          <p className="font-bold text-sm text-[#512E2E]">Paid Amount</p>
          <input
            name="paid"
            value={customerInfo.paid}
            onChange={handleCustomerInput}
            className="border p-2 rounded bg-white"
            placeholder="Paid Amount"
          />
        </div>
        <div className="w-full flex flex-col">
          <p className="font-bold text-sm text-[#512E2E]">Due Amount</p>
          <input
            readOnly
            value={formatPHP(Number(dueAmount))}
            className="border p-2 rounded bg-gray-100"
            placeholder="Due Amount"
          />
        </div>
        <div className="w-full flex flex-col">
          <p className="font-bold text-sm text-[#512E2E]">Payment Method</p>
          <select
            name="paymentMethod"
            value={customerInfo.paymentMethod}
            onChange={handleCustomerInput}
            className="border p-2 rounded bg-white"
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

      <div className="flex justify-center space-x-4 mt-6">
        <div>
          <button
            disabled={
              items?.filter((item) => item?.orderQuantity == "")?.length > 0
            }
            onClick={handleSubmit}
            className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
          >
            Update Sale
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
  );
};

export default UpdateSales;
