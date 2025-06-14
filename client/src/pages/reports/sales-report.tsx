import React, { useState, useMemo } from "react";
import Title from "@/components/title/title";
import { FaSearch } from "react-icons/fa";
import { useGetSaleList } from "@/hooks/useGetSale";
import { useGetProductList } from "@/hooks/useGetProduct";
import { useGetCustomerList } from "@/hooks/useGetCustomer";
import { formatPHP } from "@/lib/constants";

export default function SalesReport() {
  const { data: sales = [] } = useGetSaleList();
  const { data: products = [] } = useGetProductList();
  const { data: customers = [] } = useGetCustomerList();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    product: "",
    customer: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "", direction: "asc" });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortArrow = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  const salesWithNames = useMemo(() => {
    return sales.map((s: any) => {
      const cust = customers.find((c: any) => c.id === s.customerId);
      const productNames = s.saleItems
        .map((i: any) => {
          const prod = products.find((p: any) => p.id === i.productId);
          return prod?.name || i.productId;
        })
        .join(", ");

      return {
        ...s,
        customerName: cust?.name || "Unknown",
        productNames,
        invoiceTotal: s.netTotal,
        dueAmount: s.due,
        orderDateStr: new Date(s.orderDate).toLocaleDateString(),
        updatedOnStr: new Date(s.updatedOn).toLocaleDateString(),
      };
    });
  }, [sales, products, customers]);

  const uniqueProducts = Array.from(
    new Set(salesWithNames.flatMap((s: any) => s.productNames.split(", ")))
  );
  const uniqueCustomers = Array.from(
    new Set(salesWithNames.map((s: any) => s.customerName))
  );

  const filtered = useMemo(() => {
    let result = salesWithNames.filter((s: any) => {
      const od = new Date(s.orderDate);
      const sd = filters.startDate ? new Date(filters.startDate) : null;
      const ed = filters.endDate ? new Date(filters.endDate) : null;

      if (sd && od < sd) return false;
      if (ed && od > ed) return false;
      if (filters.product && !s.productNames.includes(filters.product))
        return false;
      if (filters.customer && s.customerName !== filters.customer) return false;
      if (filters.status && s.status !== filters.status) return false;
      if (
        searchTerm &&
        !s.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      return true;
    });

    // Sorting
    if (sortConfig.key) {
      result.sort((a:any, b:any) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (sortConfig.key.toLowerCase().includes("date")) {
          return sortConfig.direction === "asc"
            ? new Date(aVal).getTime() - new Date(bVal).getTime()
            : new Date(bVal).getTime() - new Date(aVal).getTime();
        }

        if (typeof aVal === "string") {
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  }, [salesWithNames, filters, searchTerm, sortConfig]);

  return (
    <div className="w-full p-5 pb-40">
      <div className="border-b mb-6 pb-3">
        <Title
          title="Sales Report"
          description="View sales report by date range, product, payment status and customer."
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded mb-5 border">
        {[
          { label: "Start Date", name: "startDate", type: "date" },
          { label: "End Date", name: "endDate", type: "date" },
          {
            label: "Product",
            name: "product",
            type: "select",
            options: ["", ...uniqueProducts],
          },
          {
            label: "Customer",
            name: "customer",
            type: "select",
            options: ["", ...uniqueCustomers],
          },
          {
            label: "Payment Status",
            name: "status",
            type: "select",
            options: ["", "Pending", "Partial", "Completed"],
          },
        ].map(({ label, name, type, options }) => (
          <div key={name}>
            <label className="text-sm font-bold text-[#512E2E] mb-1 block">
              <span className="text-red-500">*</span> {label}
            </label>
            {type === "select" ? (
              <select
                name={name}
                value={(filters as any)[name]}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [name]: e.target.value }))
                }
                className="w-full border p-2 rounded bg-white"
              >
                <option value="">--All--</option>
                {options!.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="date"
                name={name}
                value={(filters as any)[name]}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [name]: e.target.value }))
                }
                className="w-full border p-2 rounded bg-white"
              />
            )}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 flex justify-start">
        <button className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-3">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <button className="p-2 ml-2 bg-[#6b4b47] text-white rounded">
            <FaSearch size={14} />
          </button>
        </div>

        <table className="w-full table-auto text-sm">
          <thead className="bg-[#f3f3f3] text-[#512E2E] font-semibold">
            <tr>
              <th
                className="text-left px-3 py-2 cursor-pointer"
                onClick={() => handleSort("invoice")}
              >
                Invoice{renderSortArrow("invoice")}
              </th>
              <th
                className="text-left px-3 py-2 cursor-pointer"
                onClick={() => handleSort("customerName")}
              >
                Customer Name{renderSortArrow("customerName")}
              </th>
              <th
                className="text-left px-3 py-2 cursor-pointer"
                onClick={() => handleSort("orderDate")}
              >
                Order Date{renderSortArrow("orderDate")}
              </th>
              <th
                className="text-left px-3 py-2 cursor-pointer"
                onClick={() => handleSort("invoiceTotal")}
              >
                Invoice Total{renderSortArrow("invoiceTotal")}
              </th>
              <th
                className="text-left px-3 py-2 cursor-pointer"
                onClick={() => handleSort("dueAmount")}
              >
                Due Amount{renderSortArrow("dueAmount")}
              </th>
              <th
                className="text-left px-3 py-2 cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status{renderSortArrow("status")}
              </th>
              <th
                className="text-left px-3 py-2 cursor-pointer"
                onClick={() => handleSort("paymentType")}
              >
                Payment Type{renderSortArrow("paymentType")}
              </th>
              <th
                className="text-left px-3 py-2 cursor-pointer"
                onClick={() => handleSort("updatedOn")}
              >
                Updated On{renderSortArrow("updatedOn")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((entry: any, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-2">{entry.invoice}</td>
                  <td className="px-3 py-2">{entry.customerName}</td>
                  <td className="px-3 py-2">{entry.orderDateStr}</td>
                  <td className="px-3 py-2">
                    {formatPHP(Number(entry.invoiceTotal.toFixed(2)))}
                  </td>
                  <td className="px-3 py-2">
                     {formatPHP(Number(entry.dueAmount.toFixed(2)))}
                  </td>
                  <td className="px-3 py-2">{entry.status}</td>
                  <td className="px-3 py-2">{entry.paymentType}</td>
                  <td className="px-3 py-2">{entry.updatedOnStr}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            Showing {filtered.length} of {salesWithNames.length} entries
          </div>
        </div>
      </div>
    </div>
  );
}
