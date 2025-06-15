import React, { useState, useMemo } from "react";
import Title from "@/components/title/title";
import { FaSearch } from "react-icons/fa";
import { useGetSaleList } from "@/hooks/useGetSale";
import { useGetProductList } from "@/hooks/useGetProduct";
import { useGetCustomerList } from "@/hooks/useGetCustomer";
import { formatPHP } from "@/lib/constants";
import Select from "react-select";

export default function SalesReport() {
  const { data: sales = [] } = useGetSaleList();
  const { data: products = [] } = useGetProductList();
  const { data: customers = [] } = useGetCustomerList();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    product: [] as string[],
    customer: "",
    status: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "", direction: "asc" });

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

  const productOptions = uniqueProducts.map((p) => ({ value: p, label: p }));
  const customerOptions = uniqueCustomers.map((c) => ({ value: c, label: c }));

  const filtered = useMemo(() => {
    return salesWithNames.filter((s: any) => {
      const od = new Date(s.orderDate);
      const sd = filters.startDate ? new Date(filters.startDate) : null;
      const ed = filters.endDate ? new Date(filters.endDate) : null;

      if (sd && od < sd) return false;
      if (ed && od > ed) return false;

      if (
        filters.product.length > 0 &&
        !filters.product.some((p) => s.productNames.includes(p))
      )
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
  }, [salesWithNames, filters, searchTerm]);

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
        <div>
          <label className="text-sm font-bold text-[#512E2E] mb-1 block">
            Start Date
          </label>
          <input
            type="date"
            className="w-full border p-2 rounded bg-white"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#512E2E] mb-1 block">
            End Date
          </label>
          <input
            type="date"
            className="w-full border p-2 rounded bg-white"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#512E2E] mb-1 block">
            Products (Multi)
          </label>
          <Select
            isMulti
            options={productOptions}
            value={productOptions.filter((opt: any) =>
              filters.product.includes(opt.value)
            )}
            onChange={(selected) =>
              setFilters((prev: any) => ({
                ...prev,
                product: selected.map((s) => s.value),
              }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#512E2E] mb-1 block">
            Customer
          </label>
          <Select
            options={[{ value: "", label: "--All--" }, ...customerOptions]}
            value={
              customerOptions.find((opt) => opt.value === filters.customer) || {
                value: "",
                label: "--All--",
              }
            }
            onChange={(selected) =>
              setFilters((prev: any) => ({
                ...prev,
                customer: selected?.value || "",
              }))
            }
            isClearable
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#512E2E] mb-1 block">
            Payment Status
          </label>
          <select
            className="w-full border p-2 rounded bg-white"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">--All--</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
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
              {[
                "invoice",
                "customerName",
                "orderDateStr",
                "invoiceTotal",
                "dueAmount",
                "status",
                "paymentType",
                "updatedOnStr",
              ].map((key) => (
                <th
                  key={key}
                  className="text-left px-3 py-2 cursor-pointer"
                  onClick={() => handleSort(key)}
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^\w/, (c) => c.toUpperCase())}
                  {renderSortArrow(key)}
                </th>
              ))}
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
                  <td className="px-3 py-2">{formatPHP(entry.invoiceTotal)}</td>
                  <td className="px-3 py-2">{formatPHP(entry.dueAmount)}</td>
                  <td className="px-3 py-2">{entry.status}</td>
                  <td className="px-3 py-2">{entry.paymentType}</td>
                  <td className="px-3 py-2">{entry.updatedOnStr}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
