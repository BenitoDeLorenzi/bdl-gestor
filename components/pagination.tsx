"use client";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500 mt-4">
      <Button
        size="sm"
        disabled={!hasPrev}
        onClick={() => changePage(page - 1)}
      >
        Anterior
      </Button>
      <div className="flex gap-4 items-center ">
        {Array.from({ length: Math.ceil(count / ITEM_PER_PAGE) }, (_, i) => {
          const pageIndex = i + 1;
          return (
            <Button
              key={pageIndex}
              variant={page === pageIndex ? "default" : "outline"}
              size="sm"
              onClick={() => changePage(pageIndex)}
            >
              {pageIndex}
            </Button>
          );
        })}
      </div>
      <Button
        size="sm"
        onClick={() => changePage(page + 1)}
        disabled={!hasNext}
      >
        Próximo
      </Button>
    </div>
  );
};

export default Pagination;
