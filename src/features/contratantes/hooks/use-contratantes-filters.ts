import { parseAsString, useQueryStates } from "nuqs";

export const useContratantesFilter = () => {
  return useQueryStates({
    search: parseAsString,
    page: parseAsString,
  });
};
