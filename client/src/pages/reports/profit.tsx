import React, { useMemo, useState } from "react";
import Title from "@/components/title/title";
import { useGetSaleList } from "@/hooks/useGetSale";
import { useGetCustomerList } from "@/hooks/useGetCustomer";
import { useGetProductList } from "@/hooks/useGetProduct";

const ProfitReport = () => {
  const { data: sales = [] } = useGetSaleList();
  const { data: customers = [] } = useGetCustomerList();
  const { data: products = [] } = useGetProductList();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    product: "",
    customerId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale: any) => {
      const saleDate = new Date(sale.orderDate);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      const matchesDate =
        (!start || saleDate >= start) && (!end || saleDate <= end);

      const matchesCustomer =
        !filters.customerId || sale.customerId?.toString() === filters.customerId;

      const matchesProduct =
        !filters.product ||
        sale.saleItems?.some((item: any) => item.productId === filters.product);

      return matchesDate && matchesCustomer && matchesProduct;
    });
  }, [sales, filters]);

  const totalSale = filteredSales.reduce(
    (sum: number, s: any) => sum + (s.netTotal || 0),
    0
  );
  const totalPaid = filteredSales.reduce(
    (sum: number, s: any) => sum + (s.paid || 0),
    0
  );
  const totalDue = totalSale - totalPaid;

  return (
    <div className="w-full p-5 pb-40">
      <div className="border-b mb-6 pb-3">
        <Title
          title="Profit Report"
          description="View profit report by date range, product and customer."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f3f3f3] p-4 rounded mb-5">
        <div>
          <label className="text-sm font-bold text-[#512E2E]">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-white"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#512E2E]">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-white"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#512E2E]">Product</label>
          <select
            name="product"
            value={filters.product}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">--All--</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-[#512E2E]">Customer</label>
          <select
            name="customerId"
            value={filters.customerId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">--All--</option>
            {customers.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#f3f3f3] p-6 rounded text-sm font-bold text-[#512E2E] space-y-3">
        <p>
          Total Sale:{" "}
          <span className="text-black">
            Php{" "}
            {totalSale.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </p>
        <p>
          Total Payment:{" "}
          <span className="text-black">
            Php{" "}
            {totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </p>
        <p>
          Total Sales Due Amount:{" "}
          <span className="text-black">
            Php{" "}
            {totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProfitReport;
