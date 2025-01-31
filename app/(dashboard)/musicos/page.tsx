import Pagination from "@/components/pagination";
import TableSearch from "@/components/table-search";
import { Button } from "@/components/ui/button";
import { ArrowDownNarrowWide, CloudOff, Eye, Filter } from "lucide-react";
import DataTable from "@/components/data-table";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import FormModal from "@/components/form-modal";

import { ITEM_PER_PAGE } from "@/lib/settings";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export type Musicos = {
  id: string;
  nome: string;
  instrumento: string;
  funcao: string;
  telefone: string;
  cache_medio: number;
  pix: string;
  data_criacao: string;
  data_atualizacao: string;
  img: string;
};

const columns = [
  {
    header: "Nome",
    accessor: "nome",
  },
  {
    header: "Instrumento",
    accessor: "instrumento",
  },
  {
    header: "Telefone",
    accessor: "telefone",
    className: "hidden md:table-cell",
  },
  {
    header: "Cachê médio",
    accessor: "cache_medio",
    className: "hidden md:table-cell",
  },
  {
    header: "Pix",
    accessor: "pix",
    className: "hidden md:table-cell",
  },
  {
    header: "Ações",
    accessor: "actions",
  },
];

const renderRow = (item: Musicos) => (
  <TableRow key={item.id}>
    <TableCell className="">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={item.img || "https://github.com/shadcn.png"}
            className="object-cover"
          />
        </Avatar>
        <div className="flex flex-col justify-center">
          <h1 className="font-semibold">{item.nome}</h1>
          <span className="text-sm text-gray-400">{item.funcao}</span>
        </div>
      </div>
    </TableCell>
    <TableCell className="">{item.instrumento}</TableCell>
    <TableCell className="hidden md:table-cell">{item.telefone}</TableCell>
    <TableCell className="hidden md:table-cell">
      {Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.cache_medio)}
    </TableCell>
    <TableCell className="hidden md:table-cell">{item.pix}</TableCell>
    <TableCell className="">
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" asChild>
          <Link href={`/musicos/${item.id}`}>
            <Eye />
          </Link>
        </Button>
        <FormModal table="musico" type="delete" id={item.id} />
      </div>
    </TableCell>
  </TableRow>
);

const MusicosPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page } = searchParams;
  const p = page ? parseInt(page) : 1;
  const offset = (p - 1) * ITEM_PER_PAGE;

  const collectionRef = collection(db, "musicos");
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

  const data: Musicos[] = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Musicos[];

  return (
    <Card className="flex flex-col flex-1 mb-2 p-2 md:p-2">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">
            Todos os Músicos
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
              <FormModal table="musico" type="create" />
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

export default MusicosPage;
