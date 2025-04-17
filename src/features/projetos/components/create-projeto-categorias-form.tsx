"use client";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import { ProjetosCategorias } from "../types";
import { createProjetosCategoriasSchema } from "../schemas";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useCreateProjetosCategorias } from "../api/use-create-projetos-categorias";
import { useDeleteProjetosCategorias } from "../api/use-delete-projetos-categorias";

interface CreateProjetoCategoriasFormProps {
  onCancel?: () => void;
  initialValues: ProjetosCategorias[];
  projetoId: string;
}

export const CreateProjetoCategoriasForm = ({
  onCancel,
  initialValues,
  projetoId,
}: CreateProjetoCategoriasFormProps) => {
  const { mutate: mutateCreate, isPending: isPendindCreate } =
    useCreateProjetosCategorias();
  const { mutate: mutateDelete, isPending: isPendindDelete } =
    useDeleteProjetosCategorias();

  const isPending = isPendindCreate || isPendindDelete;

  const form = useForm({
    resolver: zodResolver<z.infer<typeof createProjetosCategoriasSchema>>(
      createProjetosCategoriasSchema
    ),
    defaultValues: {
      projeto_id: projetoId,
      nome: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createProjetosCategoriasSchema>) => {
    mutateCreate(
      { json: values },
      {
        onSuccess: () => {
          form.setValue("nome", "");
        },
      }
    );
  };

  const onDelete = (categoriaId: string) => {
    console.log(categoriaId);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle>Criar nova categoria</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="py-4">
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {initialValues.length > 0 && (
              <div className="flex flex-col gap-2 mt-4 overflow-y-auto max-h-[250px] px-2">
                {initialValues.map((value) => {
                  return (
                    <div
                      key={value.$id}
                      className="flex items-center justify-between "
                    >
                      <span className="text-sm">{value.nome}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="text-amber-700"
                        onClick={() =>
                          mutateDelete({ param: { categoriaId: value.$id } })
                        }
                      >
                        <Trash />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

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
              <Button size="lg" type="submit" disabled={isPending}>
                {isPending ? "Aguarde..." : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
