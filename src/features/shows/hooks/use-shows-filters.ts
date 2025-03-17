import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { ShowStatus } from "../types";

export const useShowsFilters = () => {
  return useQueryStates({
    contratanteId: parseAsString,
    status: parseAsStringEnum(Object.values(ShowStatus)),
    search: parseAsString,
    date: parseAsString,
    local: parseAsString,
    projeto: parseAsString,
  });
};
