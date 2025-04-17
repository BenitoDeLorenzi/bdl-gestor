import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { ShowStatus } from "../types";

export const useShowsFilters = () => {
  return useQueryStates({
    contratanteId: parseAsString,
    status: parseAsStringEnum(Object.values(ShowStatus)),
    search: parseAsString,
    ano: parseAsString.withDefault(new Date().getFullYear().toString()),
    local: parseAsString,
    projeto: parseAsString,
    page: parseAsString,
  });
};
