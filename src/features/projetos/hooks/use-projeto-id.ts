import { useParams } from "next/navigation";

export const useProjetoId = () => {
  const params = useParams();
  return params.projetoId as string;
};
