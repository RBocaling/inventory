import Title from "@/components/title/title";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { PiNotePencilBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetCustomerList } from "@/hooks/useGetCustomer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerApi } from "@/api/customerApi";
import { FaSearch } from "react-icons/fa";
import { formatPHP } from "@/lib/constants";

const CustomerList = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const { data: customers = [] } = useGetCustomerList();
  const queryClient = useQueryClient();

  const updateCustomerMutate = useMutation({
    mutationFn: updateCustomerApi,
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      }).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["get-Customer-lis-by-idt"],
        });
        queryClient.invalidateQueries({ queryKey: ["get-Customer-list"] });
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not update customer. Please check the form.",
      });
    },
  });

  const handleDelete = (customerId: number) => {
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
        updateCustomerMutate.mutate({
          id: Number(customerId),
          isDeleted: true,
        });
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

  const filteredCustomers = customers
    ?.map((customer: any) => {
      const totalSales = customer?.sales?.reduce(
        (sum: number, s: any) => sum + s.netTotal,
        0
      );
      const totalPaid = customer?.sales?.reduce(
        (sum: number, s: any) => sum + s.paid,
        0
      );
      const totalDue = customer?.sales?.reduce(
        (sum: number, s: any) => sum + s.due,
        0
      );
      return {
        ...customer,
        totalSales,
        totalPaid,
        totalDue,
      };
    })
    .filter((c: any) => {
      const term = searchTerm.toLowerCase();
      return (
        c?.name.toLowerCase().includes(term) ||
        c?.company.toLowerCase().includes(term) ||
        c?.address.toLowerCase().includes(term) ||
        c?.contact.includes(term)
      );
    });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (sortConfig.key === "updatedOn") {
      return sortConfig.direction === "asc"
        ? new Date(aVal).getTime() - new Date(bVal).getTime()
        : new Date(bVal).getTime() - new Date(aVal).getTime();
    }

    if (typeof aVal === "string") {
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    }
  });

  const renderSortArrow = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="w-full p-5 pb-40">
      <div className="w-full border-b mb-5 pb-3">
        <Title
          title="Customer List"
          description="View, insert or modify the customer information list."
        />
      </div>

      <div className="rounded shadow-sm bg-[#ece6e6]">
        <div className="p-4">
          <div className="bg-white rounded overflow-x-auto p-3">
            <div className="flex items-center justify-between bg-[#f1eded] pl-4 mb-4 rounded-md">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
              <button className="ml-2 p-3 bg-[#6b4b47] text-white rounded">
                <FaSearch />
              </button>
            </div>

            <table className="w-full text-sm bg-white">
              <thead className="text-[#512E2E] font-semibold">
                <tr>
                  <th className="text-left px-3 py-2">#</th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name{renderSortArrow("name")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("company")}
                  >
                    Company{renderSortArrow("company")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("address")}
                  >
                    Address{renderSortArrow("address")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("contact")}
                  >
                    Contact{renderSortArrow("contact")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("totalSales")}
                  >
                    Total Sales{renderSortArrow("totalSales")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("totalPaid")}
                  >
                    Total Paid{renderSortArrow("totalPaid")}
                  </th>
                  <th
                    className="text-left px-3 py-2 cursor-pointer"
                    onClick={() => handleSort("totalDue")}
                  >
                    Total Due{renderSortArrow("totalDue")}
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
                {sortedCustomers
                  .slice(0, entriesToShow)
                  .map((c: any, index: number) => (
                    <tr key={c.id} className="border-t">
                      <td className="text-base px-3 py-2">{index + 1}</td>
                      <td className="text-base px-3 py-2">{c.name}</td>
                      <td className="text-base px-3 py-2">{c.company}</td>
                      <td className="text-base px-3 py-2">{c.address}</td>
                      <td className="text-base px-3 py-2">{c.contact}</td>
                      <td className="text-base px-3 py-2">
                        {formatPHP(Number(c?.totalSales?.toFixed(2)))}
                      </td>
                      <td className="text-base px-3 py-2">
                        {formatPHP(Number(c?.totalPaid?.toFixed(2)))}
                      </td>
                      <td className="text-base px-3 py-2">
                        Php {formatPHP(Number(c?.totalDue?.toFixed(2)))}
                      </td>
                      <td className="text-base px-3 py-2">
                        {new Date(c?.updatedOn).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 flex items-center space-x-4">
                        <Link
                          to={`/customer-list/update-customer/${c?.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PiNotePencilBold size={20} />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(c?.id)}
                        >
                          <FaTrashCan size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {sortedCustomers.length === 0 && (
              <p className="text-center py-6 text-gray-500 text-sm">
                No customers found.
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
          to="/customer-list/add-new-customer"
          className="bg-[#6b4b47] text-white px-4 py-2 rounded hover:bg-[#593b37]"
        >
          Add New Customer
        </Link>
      </div>
    </div>
  );
};

export default CustomerList;
