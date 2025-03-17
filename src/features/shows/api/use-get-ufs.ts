import { useQuery } from "@tanstack/react-query";

export type Estado = {
  sigla: string;
  nome: string;
};

export const useGetUfs = () => {
  const query = useQuery<Estado[]>({
    queryKey: ["ufs"],
    queryFn: async () => {
      const response = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar os estados.");
      }
      const estados = await response.json();
      return estados.map((estado: any) => ({
        sigla: estado.sigla,
        nome: estado.nome,
      }));
    },
  });

  return query;
};
