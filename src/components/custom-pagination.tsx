import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useQueryState } from "nuqs";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomPaginationProps {
  totalItems: number;
  totalPages: number;
}

export const CustomPagination = ({ totalPages }: CustomPaginationProps) => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useQueryState("page", {
    defaultValue: "1",
  });

  const pageNumber = Number(currentPage);

  const onPreview = () => {
    if (pageNumber > 1) {
      setCurrentPage(String(pageNumber - 1));
    }
  };

  const onNext = () => {
    if (pageNumber < totalPages) {
      setCurrentPage(String(pageNumber + 1));
    }
  };

  const onChange = (newPage: number) => {
    setCurrentPage(String(newPage));
  };

  const getVisiblePages = (
    page: number,
    total: number
  ): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const showMiddle = [page - 1, page, page + 1].filter(
      (p) => p > 1 && p < total
    );

    pages.push(1);

    if (showMiddle[0] > 2) {
      pages.push("ellipsis");
    }

    pages.push(...showMiddle);

    if (showMiddle[showMiddle.length - 1] < total - 1) {
      pages.push("ellipsis");
    }

    pages.push(total);

    return pages;
  };

  const visiblePages = getVisiblePages(pageNumber, totalPages);

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              size="xs"
              variant="secondary"
              disabled={pageNumber === 1}
              onClick={onPreview}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {isMobile ? "" : "Anterior"}
            </Button>
          </PaginationItem>

          {visiblePages.map((p, index) => (
            <PaginationItem key={index}>
              {p === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <Button
                  size="xs"
                  variant={p === pageNumber ? "outline" : "ghost"}
                  onClick={() => onChange(p)}
                >
                  {p}
                </Button>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <Button
              size="xs"
              variant="secondary"
              disabled={pageNumber === totalPages}
              onClick={onNext}
            >
              {isMobile ? "" : "Próximo"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
