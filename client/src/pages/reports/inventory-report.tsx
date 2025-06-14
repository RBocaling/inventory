import React, { useState, useMemo } from "react";
import Title from "@/components/title/title";
import { FaSearch } from "react-icons/fa";
import { useGetSaleList } from "@/hooks/useGetSale";
import { useGetProductList } from "@/hooks/useGetProduct";
import { useGetCustomerList } from "@/hooks/useGetCustomer";

type InventoryEntry = {
  invoice: string;
  customerName: string;
  orderDate: string;
  itemsSold: number;
  itemBreakdown: string[];
  updatedOn: string;
};

export default function InventoryReport() {
  const { data: sales = [] } = useGetSaleList();
  const { data: products = [] } = useGetProductList();
  const { data: customers = [] } = useGetCustomerList();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    product: "",
    customer: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof InventoryEntry;
    direction: "asc" | "desc";
  }>({
    key: "invoice",
    direction: "asc",
  });

  const handleSort = (key: keyof InventoryEntry) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortArrow = (key: keyof InventoryEntry) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  const inventoryEntries: InventoryEntry[] = useMemo(() => {
    return sales.map((s: any) => {
      const cust = customers.find((c: any) => c.id === s.customerId);
      const breakdown = s.saleItems.map((i: any) => {
        const prod = products.find((p: any) => p.id === i.productId);
        const name = prod?.id || i.productId;
        return `${i.quantity} - ${name}`;
      });
      return {
        invoice: s.invoice.toString(),
        customerName: cust?.name || "Unknown",
        orderDate: new Date(s.orderDate).toLocaleDateString(),
        itemsSold: s.saleItems.reduce(
          (sum: number, i: any) => sum + i.quantity,
          0
        ),
        itemBreakdown: breakdown,
        updatedOn: new Date(s.updatedOn).toLocaleDateString(),
      };
    });
  }, [sales, products, customers]);

  const uniqueProducts = Array.from(
    new Set(
      inventoryEntries.flatMap((i) =>
        i.itemBreakdown.map((item) => item.split(" - ")[1])
      )
    )
  ).filter((p) => p);
  const uniqueCustomers = Array.from(
    new Set(inventoryEntries.map((i) => i.customerName))
  ).filter((c) => c);

  const filtered = useMemo(() => {
    let result = inventoryEntries.filter((entry) => {
      const od = new Date(entry.orderDate);
      const sd = filters.startDate ? new Date(filters.startDate) : null;
      const ed = filters.endDate ? new Date(filters.endDate) : null;
      if (sd && od < sd) return false;
      if (ed && od > ed) return false;
      if (filters.customer && entry.customerName !== filters.customer)
        return false;
      if (
        filters.product &&
        !entry.itemBreakdown.some((item) => item.endsWith(filters.product))
      )
        return false;
      if (
        searchTerm &&
        !entry.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (sortConfig.key === "orderDate" || sortConfig.key === "updatedOn") {
          return sortConfig.direction === "asc"
            ? new Date(aVal).getTime() - new Date(bVal).getTime()
            : new Date(bVal).getTime() - new Date(aVal).getTime();
        }

        if (typeof aVal === "string") {
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    return result;
  }, [inventoryEntries, filters, searchTerm, sortConfig]);

  const totalItemsSold = filtered.reduce((sum, cur) => sum + cur.itemsSold, 0);
  const uniqueCustomerCount = new Set(filtered.map((i) => i.customerName)).size;

  return (
    <div className="w-full p-5 pb-40">
      <div className="border-b mb-6 pb-3">
        <Title
          title="Inventory Report"
          description="View inventory report by date range, product and customer."
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f3f3f3] p-4 rounded mb-5">
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
                {options!.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt || "--All--"}
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

      <div className="mb-6">
        <button
          onClick={() => {}}
          className="bg-[#6b4b47] text-white px-6 py-2 rounded hover:bg-[#593b37]"
        >
          Search
        </button>
      </div>

      {/* Summary */}
      <div className="text-sm font-semibold text-[#512E2E] space-y-2 mb-4">
        <p>
          Number of Customers:{" "}
          <span className="font-bold">{uniqueCustomerCount}</span>
        </p>
        <p>
          Number of Items Sold:{" "}
          <span className="font-bold">{totalItemsSold}</span>
        </p>
        <p>
          Total Remaining Stock for selected products:{" "}
          <span className="font-bold">{/* Add logic if needed */}</span>
        </p>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-3">
          <input
            type="text"
            placeholder="Search customers..."
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
                className="px-3 py-2 text-left cursor-pointer"
                onClick={() => handleSort("invoice")}
              >
                Invoice{renderSortArrow("invoice")}
              </th>
              <th
                className="px-3 py-2 text-left cursor-pointer"
                onClick={() => handleSort("customerName")}
              >
                Customer Name{renderSortArrow("customerName")}
              </th>
              <th
                className="px-3 py-2 text-left cursor-pointer"
                onClick={() => handleSort("orderDate")}
              >
                Order Date{renderSortArrow("orderDate")}
              </th>
              <th
                className="px-3 py-2 text-left cursor-pointer"
                onClick={() => handleSort("itemsSold")}
              >
                Items Sold{renderSortArrow("itemsSold")}
              </th>
              <th className="px-3 py-2 text-left">Item Breakdown</th>
              <th
                className="px-3 py-2 text-left cursor-pointer"
                onClick={() => handleSort("updatedOn")}
              >
                Updated On{renderSortArrow("updatedOn")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((entry, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-2">{entry.invoice}</td>
                  <td className="px-3 py-2">{entry.customerName}</td>
                  <td className="px-3 py-2">{entry.orderDate}</td>
                  <td className="px-3 py-2">{entry.itemsSold}</td>
                  <td className="px-3 py-2 whitespace-pre-line">
                    {entry.itemBreakdown.join("\n")}
                  </td>
                  <td className="px-3 py-2">{entry.updatedOn}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            Show{" "}
            <select className="border rounded px-2 py-1">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>{" "}
            entries
          </div>
        </div>
      </div>
    </div>
  );
}
