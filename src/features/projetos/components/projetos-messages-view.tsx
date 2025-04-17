"use client";

import { Loader } from "lucide-react";
import { ProjetosFinanceDataTable } from "./projetos-finance-data-table";
import { CustomPagination } from "@/components/custom-pagination";
import { useSearchParams } from "next/navigation";
import { useGetProjeto } from "../api/use-get-projeto";
import { useGetProjetosMessages } from "../api/use-get-projetos-messages";
import { projetosMessagesColumns } from "./projetos-messages-columns";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

interface ProjetosMessagesViewProps {
  projetoId: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 10;

export const ProjetosMessagesView = ({
  projetoId,
}: ProjetosMessagesViewProps) => {
  const searchParams = useSearchParams();
  const page = +(searchParams.get("page") ?? DEFAULT_PAGE);
  const totalItems = +(searchParams.get("totalItems") ?? DEFAULT_TOTAL_ITEMS);

  const [currentPage, setPage] = useQueryState("page");

  const { data: projeto, isLoading: isLoadingProjeto } = useGetProjeto({
    projetoId: projetoId,
  });

  const { data: projetoMessages, isLoading: isLoadingProjetoMessages } =
    useGetProjetosMessages({
      projetoNome: projeto?.nome || "",
      page,
      totalItems,
    });

  const totalPages = Math.ceil((projetoMessages?.total ?? 1) / totalItems);

  const isLoading = isLoadingProjeto || isLoadingProjetoMessages;

  useEffect(() => {
    setPage("1");
  }, []);

  return (
    <div className="flex flex-col h-full justify-between">
      {isLoading ? (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <Loader className="size-7 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ProjetosFinanceDataTable
          columns={projetosMessagesColumns}
          data={projetoMessages?.documents || []}
        />
      )}

      <CustomPagination totalItems={totalItems} totalPages={totalPages} />
    </div>
  );
};
