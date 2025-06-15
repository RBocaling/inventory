import Title from "@/components/title/title";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { PiNotePencilBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetSaleList } from "@/hooks/useGetSale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSaleApi } from "@/api/saleApi";
import { formatPHP } from "@/lib/constants";

const SalesEntryList = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const { data: salesData } = useGetSaleList();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSaleApi,
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["get-sale-list"] });
        queryClient.invalidateQueries({ queryKey: ["get-sale-list-id"] });
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete sale. Please try again.",
      });
    },
  });

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id: Number(id), data: { isDeleted: true } });
      }
    });
  };

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  const filteredSales = salesData?.filter((entry: any) => {
    const term = searchTerm?.toLowerCase();
    return (
      entry?.invoice?.toString().includes(term) ||
      entry?.status?.toLowerCase().includes(term) ||
      entry?.paymentType?.toLowerCase().includes(term)
    );
  });

  const sortedSales = [...(filteredSales || [])].sort((a, b) => {
    if (!sortConfig.key) return 0;

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

    return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
  });

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-5 pb-3">
        <Title
          title="Sales Entry"
          description="View, insert or modify the sales entry list."
        />
      </div>

      <div className="rounded shadow-sm bg-[#ece6e6]">
        <div className="p-4">
          <div className="bg-white rounded p-3 overflow-x-auto">
            <div className="flex items-center rounded-md justify-between bg-[#f1eded] pl-4 mb-4">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
              <button className="ml-2 p-3 bg-[#6b4b47] text-white rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>

            <table className="w-full text-sm bg-white">
              <thead className="text-[#512E2E] font-semibold">
                <tr>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("invoice")}
                  >
                    ID{renderSortArrow("invoice")}
                  </th>
                  <th
                    onClick={() => handleSort("customer")}
                    className="text-left px-3 py-2"
                  >
                    Customer Name
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("orderDate")}
                  >
                    Order Date{renderSortArrow("orderDate")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("netTotal")}
                  >
                    Net Total{renderSortArrow("netTotal")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("paid")}
                  >
                    Paid{renderSortArrow("paid")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("due")}
                  >
                    Due{renderSortArrow("due")}
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
                    onClick={() => handleSort("referenceNumber")}
                  >
                    reference Number{renderSortArrow("referenceNumber")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("updatedOn")}
                  >
                    Updated On{renderSortArrow("updatedOn")}
                  </th>
                  <th className="text-left px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedSales
                  ?.slice(0, entriesToShow)
                  .map((entry: any, index) => (
                    <tr key={entry?.id} className="border-t">
                      <td className="text-base px-3 py-2">{index + 1}</td>
                      <td className="text-base px-3 py-2">{entry?.customer}</td>
                      <td className="text-base px-3 py-2">
                        {new Date(entry?.orderDate).toLocaleDateString()}
                      </td>
                      <td className="text-base px-3 py-2">
                        {formatPHP(Number(entry?.netTotal?.toFixed(2)))}
                      </td>
                      <td className="text-base px-3 py-2">
                        {formatPHP(Number(entry?.paid?.toFixed(2)))}
                      </td>
                      <td className="text-base px-3 py-2">
                        {formatPHP(Number(entry?.due?.toFixed(2)))}
                      </td>
                      <td className="text-base px-3 py-2">{entry?.status}</td>
                      <td className="text-base px-3 py-2">
                        {entry?.paymentType}
                      </td>
                      <td className="text-base px-3 py-2">
                        {entry?.referenceNumber}
                      </td>
                      <td className="text-base px-3 py-2">
                        {new Date(entry?.updatedOn).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 flex items-center space-x-4">
                        <Link
                          to={`/sales-entry/update-sale/${entry?.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PiNotePencilBold size={20} />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(entry?.id)}
                        >
                          <FaTrashCan size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {sortedSales?.length === 0 && (
              <p className="text-center py-6 text-gray-500 text-sm">
                No sales entries found.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-sm text-gray-900 font-bold">
          Show{" "}
          <select
            className="border rounded px-2 py-1"
            value={entriesToShow}
            onChange={(e) => setEntriesToShow(parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>{" "}
          entries
        </div>

        <Link
          to="/sales-entry/add-new-sale"
          className="bg-[#6b4b47] text-white px-4 py-2 rounded hover:bg-[#593b37]"
        >
          Add New Sales
        </Link>
      </div>
    </div>
  );
};

export default SalesEntryList;
