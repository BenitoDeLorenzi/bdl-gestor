/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CircleCheck, Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import {
  deleteContratante,
  deleteFaturamento,
  deleteMusico,
  deleteShow,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { FormContainerProps } from "./form-container";

const deleteActionMap = {
  musico: deleteMusico,
  contratante: deleteContratante,
  show: deleteShow,
  faturamento: deleteFaturamento,
  usuario: deleteShow,
  notificacao: deleteShow,
};

const MusicoForm = dynamic(() => import("./forms/MusicoForm"), {
  loading: () => (
    <div className="w-full flex flex-1 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin h-8 w-8" />
      <span className="font-semibold text-muted-foreground">Carregando...</span>
    </div>
  ),
});

const ContratanteForm = dynamic(() => import("./forms/ContratanteForm"), {
  loading: () => (
    <div className="w-full flex flex-1 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin h-8 w-8" />
      <span className="font-semibold text-muted-foreground">Carregando...</span>
    </div>
  ),
});

const ShowForm = dynamic(() => import("./forms/ShowForm"), {
  loading: () => (
    <div className="w-full flex flex-1 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin h-8 w-8" />
      <span className="font-semibold text-muted-foreground">Carregando...</span>
    </div>
  ),
});

const FaturamentoForm = dynamic(() => import("./forms/FaturamentoForm"), {
  loading: () => (
    <div className="w-full flex flex-1 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin h-8 w-8" />
      <span className="font-semibold text-muted-foreground">Carregando...</span>
    </div>
  ),
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  musico: (setOpen, type, data) => (
    <MusicoForm type={type} data={data} setOpen={setOpen} />
  ),
  contratante: (setOpen, type, data) => (
    <ContratanteForm type={type} data={data} setOpen={setOpen} />
  ),
  show: (setOpen, type, data, relatedData) => (
    <ShowForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  faturamento: (setOpen, type, data, relatedData) => (
    <FaturamentoForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const bgColor =
    type === "delete"
      ? "destructive"
      : type === "create"
      ? "default"
      : "outline";
  const icon =
    type === "create" ? (
      table === "faturamento" ? (
        <CircleCheck />
      ) : (
        <Plus />
      )
    ) : type === "update" ? (
      <Edit />
    ) : (
      <Trash2 />
    );

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast({
          variant: "default",
          title: `${
            table === "contratante"
              ? "Contratante"
              : table === "musico"
              ? "Músico"
              : "Show"
          } excluido com sucesso.`,
        });
        setOpen(false);
        router.refresh();
      }
    }, [state]);

    return type === "delete" && id ? (
      <DialogContent aria-describedby="">
        <form action={formAction} className="flex flex-col gap-4">
          <input type="text | number" name="id" value={id} readOnly hidden />
          <DialogHeader>
            <DialogTitle>Deseja excluir ?</DialogTitle>
            <DialogDescription>
              Todos os dados serão excluidos. Você tem certeza que deseja
              excluir esse {table.toUpperCase()}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive">
              <Trash2 />
              Excluir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Formulário não encontrado"
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="icon" variant={bgColor} onClick={() => setOpen(true)}>
        {icon}
      </Button>
      <Form />
    </Dialog>
  );
};

export default FormModal;
