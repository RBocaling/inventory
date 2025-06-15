import { Link } from "react-router-dom";
import Title from "@/components/title/title";
import { useGetInfo } from "@/hooks/useGetInfo";

const Reports = () => {
  const { data } = useGetInfo();

  const reports = [
    {
      title: "View Sales Report",
      description:
        "Click to view report on the sales for a specific date range, product and/or customer.",
      icon: "/icons/shirt.png",
      to: "/reports/sales",
      isAllowed: true,
    },
    {
      title: "View Inventory Report",
      description:
        "Click to view report on the inventory count information for a specific date range, product and/or customer.",
      icon: "/icons/coins.png",
      to: "/reports/inventory",
      isAllowed: data?.role === "ADMIN" || data?.role === "OWNER",
    },
    {
      title: "View Profit Report",
      description:
        "Click to view report on the profit information  for a specific date range, product and/or customer.",
      icon: "/icons/coins.png",
      to: "/reports/profit",
      isAllowed: data?.role === "ADMIN" || data?.role === "OWNER",
    },
  ];
  console.log("reports", reports);

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-5 pb-2">
        <Title title="Reports" description="View sales or profit reports." />
      </div>

      <div className="flex flex-wrap justify-start items-start gap-20 px-12 py-7">
        {reports
          ?.filter((item: any) => item.isAllowed)
          .map((report, index) => (
            <Link
              to={report.to}
              key={index}
              className="flex flex-col items-start justify-center  group max-w-[230px] bg-reds-500"
            >
              <div className="border border-black rounded-full p-5 w-24 h-24 flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-105">
                <img src={report.icon} alt="" />
              </div>
              <h3 className="text-[#6b4b47] font-bold text-lg underline">
                {report.title}
              </h3>
              <p className="text-lg text-gray-700 mt-1">{report.description}</p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Reports;
