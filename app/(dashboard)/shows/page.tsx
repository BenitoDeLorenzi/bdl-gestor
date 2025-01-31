import DataTable from "@/components/data-table";
import FormContainer from "@/components/form-container";
import Pagination from "@/components/pagination";
import TableSearch from "@/components/table-search";
import { Button } from "@/components/ui/button";
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
import {
  ArrowDownNarrowWide,
  BadgeAlert,
  BadgeCheck,
  CloudOff,
  Filter,
} from "lucide-react";
import { Contratantes } from "../contratantes/page";
import moment from "moment";
import { Card } from "@/components/ui/card";

export type Shows = {
  id: string;
  contratante: Contratantes;
  musicos: string[];
  data_show: string;
  horario_show: string;
  local: string;
  valor: number;
  custo: number;
  descricao?: string;
  valor_caixa?: string;
  tipo_projeto: string;
  despesas: { descricao: string; valor: number }[];
  finalizado: boolean;
};

const columns = [
  {
    header: "",
    accessor: "finalizado",
    className: "w-[20px]",
  },
  {
    header: "Contratante",
    accessor: "contratante",
  },

  {
    header: "Local",
    accessor: "local",
    className: "hidden md:table-cell",
  },
  {
    header: "Data",
    accessor: "data",
    className: "hidden md:table-cell",
  },
  {
    header: "Horário",
    accessor: "cache_medio",
    className: "hidden md:table-cell",
  },
  {
    header: "Projeto",
    accessor: "tipo_projeto",
    className: "hidden md:table-cell",
  },
  {
    header: "Valor",
    accessor: "valor",
  },
  {
    header: "Ações",
    accessor: "actions",
  },
];

const renderRow = (item: Shows) => (
  <TableRow key={item.id}>
    <TableCell className="">
      {item.finalizado ? (
        <BadgeCheck size={22} color="#ecf0f1" fill="#27ae60" />
      ) : (
        <BadgeAlert size={22} color="#ecf0f1" fill="#3498db" />
      )}
    </TableCell>
    <TableCell className="">{item.contratante.nome}</TableCell>
    <TableCell className="hidden md:table-cell">{item.local}</TableCell>
    <TableCell className="hidden md:table-cell">
      {moment(item.data_show, "YYYY-MM-DD").format("DD-MM-YYYY")}
    </TableCell>
    <TableCell className="hidden md:table-cell">{item.horario_show}</TableCell>
    <TableCell className="hidden md:table-cell">{item.tipo_projeto}</TableCell>
    <TableCell className="">
      {Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.valor)}
    </TableCell>
    <TableCell className="">
      <div className="flex items-center gap-2">
        <FormContainer table="show" type="update" data={item} />
        <FormContainer table="show" type="delete" id={item.id} />
        {!item.finalizado && (
          <FormContainer table="faturamento" type="create" id={item.id} />
        )}
      </div>
    </TableCell>
  </TableRow>
);

const ShowsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page } = searchParams;
  const p = page ? parseInt(page) : 1;
  const offset = (p - 1) * ITEM_PER_PAGE;

  const collectionRef = collection(db, "shows");
  const baseQuery = query(
    collectionRef,
    orderBy("data_show", "desc"),
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

  const data: Shows[] = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Shows[];

  return (
    <Card className="flex flex-col flex-1 mb-2 p-2 md:p-2">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">
            Todos os Shows
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
              <FormContainer table="show" type="create" />
            </div>
          </div>
        </div>
        {count === 0 ? (
          <div className="flex flex-col justify-center items-center h-full gap-4">
            <CloudOff size={70} />
            <h1>Sem shows no momento...</h1>
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

export default ShowsPage;
