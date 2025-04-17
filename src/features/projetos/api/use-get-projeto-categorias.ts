import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetProjetoCategoriasProps {
  projetoId: string;
}

export const useGetProjetoCategorias = ({
  projetoId,
}: UseGetProjetoCategoriasProps) => {
  return useQuery({
    queryKey: ["projeto-categorias", projetoId],
    queryFn: async () => {
      const response = await client.api.projetos["categorias"][
        ":projetoId"
      ].$get({
        param: { projetoId },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar as categorias.");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
