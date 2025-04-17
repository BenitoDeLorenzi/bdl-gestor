import { parseAsString, useQueryStates } from "nuqs";

export const useLocaisFilters = () => {
  return useQueryStates({
    tipo: parseAsString,
    search: parseAsString,
    page: parseAsString,
  });
};
