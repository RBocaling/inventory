import React, { useMemo, useState } from "react";
import Title from "@/components/title/title";
import { useGetSaleList } from "@/hooks/useGetSale";
import { useGetCustomerList } from "@/hooks/useGetCustomer";
import { useGetProductList } from "@/hooks/useGetProduct";
import Select from "react-select";
import { useGetInfo } from "@/hooks/useGetInfo";

const ProfitReport = () => {
  const { data: sales = [] } = useGetSaleList();
  const { data: customers = [] } = useGetCustomerList();
  const { data: products = [] } = useGetProductList();
  const { data } = useGetInfo();
  if (data?.role === "EMPLOYEE") {
    return null;
  }
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    products: [] as string[],
    customerId: "",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (selected: any) => {
    setFilters((prev) => ({
      ...prev,
      products: selected ? selected.map((s: any) => s.value) : [],
    }));
  };

  const handleCustomerChange = (selected: any) => {
    setFilters((prev) => ({
      ...prev,
      customerId: selected?.value || "",
    }));
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale: any) => {
      const saleDate = new Date(sale.orderDate);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      const matchesDate =
        (!start || saleDate >= start) && (!end || saleDate <= end);

      const matchesCustomer =
        !filters.customerId ||
        sale.customerId?.toString() === filters.customerId;

      const matchesProduct =
        filters.products.length === 0 ||
        sale.saleItems?.some((item: any) =>
          filters.products.includes(item.productId)
        );

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

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f3f3f3] p-4 rounded mb-5">
        <div>
          <label className="text-sm font-bold text-[#512E2E]">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleDateChange}
            className="w-full border p-2 rounded bg-white"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#512E2E]">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleDateChange}
            className="w-full border p-2 rounded bg-white"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#512E2E]">
            Product (Multiple)
          </label>
          <Select
            isMulti
            isClearable
            options={products.map((p: any) => ({
              label: `${p.name} (${p.id})`,
              value: p.id,
            }))}
            value={filters.products.map((id) => {
              const prod = products.find((p: any) => p.id === id);
              return { label: `${prod?.name} (${id})`, value: id };
            })}
            onChange={handleProductChange}
            className="bg-white"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#512E2E]">Customer</label>
          <Select
            isClearable
            options={customers.map((c: any) => ({
              label: c.name,
              value: c.id.toString(),
            }))}
            value={
              filters.customerId
                ? {
                    label:
                      customers.find(
                        (c: any) => c.id.toString() === filters.customerId
                      )?.name || "",
                    value: filters.customerId,
                  }
                : null
            }
            onChange={handleCustomerChange}
            className="bg-white"
          />
        </div>
      </div>

      {/* Summary */}
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
