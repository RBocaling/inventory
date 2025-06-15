import React, { useState, useMemo } from "react";
import Title from "@/components/title/title";
import { FaSearch } from "react-icons/fa";
import Select from "react-select";
import { useGetSaleList } from "@/hooks/useGetSale";
import { useGetProductList } from "@/hooks/useGetProduct";
import { useGetCustomerList } from "@/hooks/useGetCustomer";
import { useGetInfo } from "@/hooks/useGetInfo";

export default function InventoryReport() {
  const { data: sales = [] } = useGetSaleList();
  const { data: products = [] } = useGetProductList();
  const { data: customers = [] } = useGetCustomerList();
  const { data } = useGetInfo();
  if (data?.role === "EMPLOYEE") {
    return null;
  }
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    products: [] as string[],
    customer: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "invoice",
    direction: "asc",
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortArrow = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  const inventoryEntries = useMemo(() => {
    return sales.map((s: any) => {
      const cust = customers.find((c: any) => c.id === s.customerId);
      const breakdown = s.saleItems.map((i: any) => {
        const prod = products.find((p: any) => p.id === i.productId);
        const name = prod?.name || i.productId;
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

  const uniqueProducts = Array.from(new Set(products.map((p: any) => p.name)));

  const uniqueCustomers = Array.from(
    new Set(customers.map((c: any) => c.name))
  );

  const filtered = useMemo(() => {
    return inventoryEntries.filter((entry: any) => {
      const od = new Date(entry.orderDate);
      const sd = filters.startDate ? new Date(filters.startDate) : null;
      const ed = filters.endDate ? new Date(filters.endDate) : null;

      if (sd && od < sd) return false;
      if (ed && od > ed) return false;

      if (
        filters.products.length > 0 &&
        !entry.itemBreakdown.some((item: any) =>
          filters.products.some((p) => item.includes(p))
        )
      )
        return false;

      if (filters.customer && entry.customerName !== filters.customer)
        return false;

      if (
        searchTerm &&
        !entry.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      return true;
    });
  }, [inventoryEntries, filters, searchTerm]);

  const totalItemsSold = filtered.reduce(
    (sum: any, cur: any) => sum + cur.itemsSold,
    0
  );
  const uniqueCustomerCount = new Set(filtered.map((i: any) => i.customerName))
    .size;
  const totalRemainingStock = products.reduce(
    (sum: number, p: any) =>
      filters.products.length === 0 || filters.products.includes(p.name)
        ? sum + (p.remainingStock || 0)
        : sum,
    0
  );

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
        <div>
          <label className="text-sm font-bold block">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="w-full border p-2 rounded bg-white"
          />
        </div>
        <div>
          <label className="text-sm font-bold block">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="w-full border p-2 rounded bg-white"
          />
        </div>
        <div>
          <label className="text-sm font-bold block">Product (Multiple)</label>
          <Select
            isMulti
            options={uniqueProducts.map((p) => ({ label: p, value: p })) as any}
            value={filters.products.map((p) => ({ label: p, value: p }))}
            onChange={(selected) =>
              setFilters((prev) => ({
                ...prev,
                products: selected.map((s) => s.value),
              }))
            }
            className="bg-white"
          />
        </div>
        <div>
          <label className="text-sm font-bold block">Customer</label>
          <Select
            isClearable
            options={
              uniqueCustomers.map((c) => ({ label: c, value: c })) as any
            }
            value={
              filters.customer
                ? { label: filters.customer, value: filters.customer }
                : null
            }
            onChange={(selected) =>
              setFilters((prev) => ({
                ...prev,
                customer: selected?.value || "",
              }))
            }
            className="bg-white"
          />
        </div>
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
          Total Remaining Stock:{" "}
          <span className="font-bold">{totalRemainingStock}</span>
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
              filtered.map((entry: any, idx: number) => (
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
      </div>
    </div>
  );
}
