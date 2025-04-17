import { parseAsString, useQueryStates } from "nuqs";

export const useTiposFilter = () => {
  return useQueryStates({
    search: parseAsString,
    page: parseAsString,
  });
};
