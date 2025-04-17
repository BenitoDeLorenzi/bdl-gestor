import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { ProjetosFinanceStatus } from "../types";

export const useProjetosFinanceFilters = () => {
  return useQueryStates({
    status: parseAsStringEnum(Object.values(ProjetosFinanceStatus)),
    categoria: parseAsString,
    forma_pagamento: parseAsString,
    page: parseAsString,
    tipo: parseAsString,
  });
};
