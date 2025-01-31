import TableSearch from "@/components/table-search";
import { Button } from "@/components/ui/button";
import { ArrowDownNarrowWide, CloudOff, Filter } from "lucide-react";
import DataTable from "@/components/data-table";
import { TableCell, TableRow } from "@/components/ui/table";
import FormModal from "@/components/form-modal";
import FormContainer from "@/components/form-container";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import Pagination from "@/components/pagination";
import { ITEM_PER_PAGE } from "@/lib/settings";

export type Contratantes = {
  id: string;
  nome: string;
  contato: string;
  cidade: string;
  estado: string;
  endereco?: string;
  telefone: string;
  email?: string;
  tipo: string;
  data_criacao: string;
  data_atualizacao: string;
};

const columns = [
  {
    header: "Nome",
    accessor: "nome",
  },
  {
    header: "Tipo",
    accessor: "tipo",
    className: "hidden md:table-cell",
  },
  {
    header: "Contato",
    accessor: "contato",
    className: "hidden md:table-cell",
  },
  {
    header: "Cidade",
    accessor: "cidade",
  },
  {
    header: "Telefone",
    accessor: "telefone",
    className: "hidden md:table-cell",
  },
  {
    header: "Ações",
    accessor: "actions",
  },
];

const renderRow = (item: Contratantes) => (
  <TableRow key={item.id}>
    <TableCell className="">{item.nome}</TableCell>
    <TableCell className="hidden md:table-cell">{item.tipo}</TableCell>
    <TableCell className="hidden md:table-cell">{item.contato}</TableCell>
    <TableCell className="">
      {item.cidade} / {item.estado}
    </TableCell>
    <TableCell className="hidden md:table-cell">{item.telefone}</TableCell>
    <TableCell className="">
      <div className="flex items-center gap-2">
        <FormContainer table="contratante" type="update" data={item} />
        <FormContainer table="contratante" type="delete" id={item.id} />
      </div>
    </TableCell>
  </TableRow>
);

const ContratantesPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page } = searchParams;
  const p = page ? parseInt(page) : 1;
  const offset = (p - 1) * ITEM_PER_PAGE;

  const collectionRef = collection(db, "contratantes");
  const baseQuery = query(collectionRef, orderBy("nome"), limit(ITEM_PER_PAGE));

  const allDocs = await getDocs(collectionRef);
  const count = allDocs.size;

  let paginatedQuery = baseQuery;

  if (offset > 0) {
    const snapshot = await getDocs(baseQuery);
    const lastVisible = snapshot.docs[offset - 1];
    if (lastVisible) {
      paginatedQuery = query(baseQuery, startAfter(lastVisible));
    }
  }

  const querySnapshot = await getDocs(paginatedQuery);

  const data = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Todos os Contratantes
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <Button size="icon" variant="outline">
              <Filter />
            </Button>
            <Button size="icon" variant="outline">
              <ArrowDownNarrowWide />
            </Button>
            <FormModal table="contratante" type="create" />
          </div>
        </div>
      </div>
      {count === 0 ? (
        <div className="flex flex-col justify-center items-center h-full gap-4">
          <CloudOff size={70} />
          <h1>Sem contratantes no momento...</h1>
        </div>
      ) : (
        <div>
          <DataTable columns={columns} renderRow={renderRow} data={data} />
          <Pagination page={p} count={count} />
        </div>
      )}
    </div>
  );
};

export default ContratantesPage;
