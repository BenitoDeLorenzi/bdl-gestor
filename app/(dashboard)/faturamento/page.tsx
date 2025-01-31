import DataTable from "@/components/data-table";
import FormModal from "@/components/form-modal";
import Pagination from "@/components/pagination";
import TableSearch from "@/components/table-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { db } from "@/lib/firebaseconfig";
import { ITEM_PER_PAGE } from "@/lib/settings";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { ArrowDownNarrowWide, CloudOff, Filter } from "lucide-react";
import moment from "moment";

export type Faturamentos = {
  id?: string;
  show_id: string;
  contratante_id: string;
  contratante_nome: string;
  data_show: string;
  valor: number;
  despesa_musicos: {
    id: string;
    nome: string;
    valor: number;
  }[];
  despesas: { descricao: string; valor: number }[];
  valor_final: number;
  valor_despesas: number;
  data_criacao: string;
  data_atualizacao: string;
};

const columns = [
  {
    header: "Contratante",
    accessor: "contratante_nome",
  },
  {
    header: "Data Show",
    accessor: "data_show",
    className: "hidden md:table-cell",
  },
  {
    header: "Data Pagamento",
    accessor: "data_criacao",
    className: "hidden md:table-cell",
  },
  {
    header: "Valor Show",
    accessor: "valor",
    className: "hidden md:table-cell",
  },
  {
    header: "Valor despesas",
    accessor: "valor_despesas",
    className: "hidden md:table-cell",
  },
  {
    header: "Valor Recebido",
    accessor: "valor_final",
  },
  {
    header: "Ações",
    accessor: "actions",
  },
];

const renderRow = (item: Faturamentos) => (
  <TableRow key={item.id}>
    <TableCell className="">{item.contratante_nome}</TableCell>
    <TableCell className="hidden md:table-cell">
      {moment(item.data_show, "YYYY-MM-DD").format("DD-MM-YYYY")}
    </TableCell>
    <TableCell className="hidden md:table-cell">
      {moment(item.data_criacao).format("DD-MM-YYYY")}
    </TableCell>
    <TableCell className="hidden md:table-cell">
      {Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.valor)}
    </TableCell>
    <TableCell className="hidden md:table-cell">
      {Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.valor_despesas)}
    </TableCell>
    <TableCell>
      {Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.valor_final)}
    </TableCell>

    <TableCell className="">
      <div className="flex items-center gap-2">
        <FormModal table="faturamento" type="delete" id={item.id} />
      </div>
    </TableCell>
  </TableRow>
);

const FaturamentoPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page } = searchParams;
  const p = page ? parseInt(page) : 1;
  const offset = (p - 1) * ITEM_PER_PAGE;

  const collectionRef = collection(db, "faturamentos");
  const baseQuery = query(
    collectionRef,
    orderBy("data_criacao", "desc"),
    limit(ITEM_PER_PAGE)
  );

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

  const data: Faturamentos[] = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Faturamentos[];

  return (
    <Card className="flex flex-col flex-1 mb-2 p-2 md:p-2">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">
            Todos os Faturamentos
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
            </div>
          </div>
        </div>
        {count === 0 ? (
          <div className="flex flex-col justify-center items-center h-full gap-4">
            <CloudOff size={70} />
            <h1>Sem músicos no momento...</h1>
          </div>
        ) : (
          <div>
            <DataTable columns={columns} renderRow={renderRow} data={data} />
            <Pagination page={p} count={count} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default FaturamentoPage;
