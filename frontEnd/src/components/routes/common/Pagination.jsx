import { Button } from "@/components/ui/button";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

export function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const getDisplayedPages = () => {
    if (totalPages <= 3) {
      // If there are less than or equal to 3 pages, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage === 1) {
      // If we're on the first page, show [1, 2, 3]
      return [1, 2, 3];
    } else if (currentPage === totalPages) {
      // If we're on the last page, show [totalPages-2, totalPages-1, totalPages]
      return [totalPages - 2, totalPages - 1, totalPages];
    } else {
      // Show the previous page, current page, and next page
      return [currentPage - 1, currentPage, currentPage + 1];
    }
  };

  const displayedPages = getDisplayedPages();

  return (
    <div className="mt-8 flex justify-between items-center">
      <Button
        variant="outline"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="h-4 w-4" /> Previous
      </Button>
      <div className="space-x-2">
        {displayedPages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
