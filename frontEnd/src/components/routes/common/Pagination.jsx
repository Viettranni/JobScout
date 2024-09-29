import { Button } from "@/components/ui/button";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
import ScrollToTop from "../../../ScrollToTop"; // Import the ScrollToTop component

export function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    let startPage, endPage;

    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage === 1) {
        startPage = 1;
        endPage = 3;
      } else if (currentPage === totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  console.log(`Navigating to page ${currentPage}`);

  return (
    <div className="mt-8 flex justify-between items-center">
      {/* Inject ScrollToTop and pass currentPage as the trigger */}
      <ScrollToTop trigger={currentPage} />

      {/* Previous button */}
      <Button
        variant="outline"
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
      </Button>

      {/* Page numbers */}
      <div className="space-x-2">
        {renderPageNumbers().map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next <ChevronRightIcon className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
