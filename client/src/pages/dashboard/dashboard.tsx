// Dashboard.tsx
import React from "react";
import Title from "@/components/title/title";
import CardDashboard from "./components/card"; 
import { useGetProductList } from "@/hooks/useGetProduct";
import { useGetSaleList } from "@/hooks/useGetSale";
import { useGetCustomerList } from "@/hooks/useGetCustomer";

interface DashboardMetric {
  label: string;
  value: string | number;
  Icon: string;
  isMain: boolean;
}

export default function Dashboard() {
  const { data: sales = [] } = useGetSaleList();

  const now = new Date();
  const isSameDay = (d: string) => {
    const dt = new Date(d);
    return (
      (dt as any).getFullYear() === (now as any).getFullYear() &&
      dt.getMonth() === now.getMonth() &&
      dt.getDate() === now.getDate()
    );
  };
  const isSameMonth = (d: string) => {
    const dt = new Date(d);
    return (
      (dt as any).getFullYear() === (now as any).getFullYear() && dt.getMonth() === now.getMonth()
    );
  };
  const isSameYear = (d: string) =>
    (new Date(d) as any).getFullYear() === (now as any).getFullYear();

  let dayProducts = 0;
  let daySalesTotal = 0;
  let monthProducts = 0;
  let monthSalesTotal = 0;
  let yearProducts = 0;
  let yearSalesTotal = 0;

  sales.forEach((sale:any) => {
    const date = sale.updatedOn;
    const totalItems =
      sale.saleItems?.reduce((sum:any, si:any) => sum + si.quantity, 0) || 0;
    if (isSameDay(date)) {
      dayProducts += totalItems;
      daySalesTotal += sale.netTotal;
    }
    if (isSameMonth(date)) {
      monthProducts += totalItems;
      monthSalesTotal += sale.netTotal;
    }
    if (isSameYear(date)) {
      yearProducts += totalItems;
      yearSalesTotal += sale.netTotal;
    }
  });

  const metrics: DashboardMetric[] = [
    {
      label: "Daily # of Customers",
      value: new Set(
        sales.filter((s:any) => isSameDay(s.updatedOn)).map((s:any) => s.customerId)
      ).size,
      Icon: "/icons/person-walk.png",
      isMain: true,
    },
    {
      label: "Daily # of Products Sold",
      value: dayProducts,
      Icon: "/icons/shirt.png",
      isMain: true,
    },
    {
      label: "Daily Sales Amount",
      value: `Php ${daySalesTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
      Icon: "/icons/coins.png",
      isMain: true,
    },
    {
      label: "Monthly # of Customers",
      value: new Set(
        sales.filter((s:any) => isSameMonth(s.updatedOn)).map((s:any) => s.customerId)
      ).size,
      Icon: "/icons/person-walk.png",
      isMain: false,
    },
    {
      label: "Monthly # of Products Sold",
      value: monthProducts,
      Icon: "/icons/shirt.png",
      isMain: false,
    },
    {
      label: "Monthly Sales Amount",
      value: `Php ${monthSalesTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
      Icon: "/icons/coins.png",
      isMain: false,
    },
    {
      label: "Yearly # of Customers",
      value: new Set(
        sales.filter((s:any) => isSameYear(s.updatedOn)).map((s:any) => s.customerId)
      ).size,
      Icon: "/icons/person-walk.png",
      isMain: false,
    },
    {
      label: "Yearly # of Products Sold",
      value: yearProducts,
      Icon: "/icons/shirt.png",
      isMain: false,
    },
    {
      label: "Yearly Sales Amount",
      value: `Php ${yearSalesTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
      Icon: "/icons/coins.png",
      isMain: false,
    },
  ];

  return (
    <div className="w-full p-5 pb-40">
      <Title
        title="Dashboard Overview"
        description="Displays an overview of customers, products, and sales entries for today, this month, and year."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-10">
        {metrics.map((m, i) => (
          <CardDashboard
            key={i}
            Icon={m.Icon}
            label={m.label}
            value={m.value}
            isMain={m.isMain}
          />
        ))}
      </div>
    </div>
  );
}
