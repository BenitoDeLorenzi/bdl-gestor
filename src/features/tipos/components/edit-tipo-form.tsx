"use client";

import { useForm } from "react-hook-form";
import { createTiposSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tipos } from "../types";
import { useUpdateTipo } from "../api/use-update-tipo";

interface EditTipoFormProps {
  onCancel: () => void;
  initialValues: Tipos;
}

const title: Record<string, string> = {
  locais: "Editar tipo de local",
  funcoes: "Editar tipo de função",
  instrumentos: "Editar tipo de instrumento",
  projetos: "Editar tipo de projeto",
};

export const EditTipoForm = ({
  onCancel,
  initialValues,
}: EditTipoFormProps) => {
  const { mutate, isPending } = useUpdateTipo();
  const form = useForm({
    resolver: zodResolver<z.infer<typeof createTiposSchema>>(createTiposSchema),
    defaultValues: {
      nome: initialValues.nome,
      tipo: initialValues.tipo,
    },
  });

  const onSubmit = (values: z.infer<typeof createTiposSchema>) => {
    mutate(
      { json: values, param: { tipoId: initialValues.$id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel();
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle>{title[initialValues.tipo]}</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="py-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="py-4">
              <DottedSeparator />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={onCancel}
                className={cn(!onCancel && "invisible")}
              >
                Cancelar
              </Button>
              <Button
                size="lg"
                type="submit"
                loading={isPending}
                effect="gooeyLeft"
              >
                {isPending ? "Aguarde..." : "Atualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
