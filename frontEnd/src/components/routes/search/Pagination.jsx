import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

export function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="mt-8 flex justify-between items-center">
      <Button
        variant="outline"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next Page <ChevronRightIcon className="ml-2 h-4 w-4" />
      </Button>
      <div className="space-x-2">
        {[1, 2, 3].map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
