import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NoRecord from "./noRecord";

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination= ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}:PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 1) return [];

    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    totalItems > 0 ? <div className="flex items-center justify-center gap-2 bg-transparent p-3 rounded-md text-white mt-5">
      <Button
       
        className="px-4 py-2 text-sm flex items-center gap-2 rounded-md hover:bg-primary/80 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-5 h-5" />
        Previous
      </Button>

      {getPages().map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "default" : "ghost"}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            page === currentPage
              ? "bg-white text-primary"
              : "hover:bg-primary text-neutral-500"
          }`}
          disabled={page === "..."}
          onClick={() => typeof page === "number" && onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
       
        className="px-4 py-2 text-sm flex items-center gap-2 rounded-md hover:bg-primary/80 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>: <NoRecord/>
  );
};

export default Pagination;
