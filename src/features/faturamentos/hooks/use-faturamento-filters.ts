import { parseAsString, useQueryStates } from "nuqs";

export const useFaturamentoFilters = () => {
  return useQueryStates({
    contratante: parseAsString,
    local: parseAsString,
    ano: parseAsString.withDefault(new Date().getFullYear().toString()),
    page: parseAsString,
  });
};
