import { parseAsString, useQueryStates } from "nuqs";

export const useEquipeFilters = () => {
  return useQueryStates({
    search: parseAsString,
    funcao: parseAsString,
    instrumento: parseAsString,
    page: parseAsString,
  });
};
