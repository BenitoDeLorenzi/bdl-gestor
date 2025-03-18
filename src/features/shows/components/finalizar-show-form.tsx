"use client";

import { z } from "zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";

import { createFaturamentoSchema } from "../schemas";

import DottedSeparator from "@/components/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { useUpdateShow } from "../api/use-update-show";
import { Contratante } from "@/features/contratantes/types";
import { Locais } from "@/features/locais/types";
import { Equipe } from "@/features/equipe/types";
import { CirclePlus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { DateTimePicker } from "@/components/date-time-picker";
import { useCreateFaturamento } from "../api/use-create-faturamento";

interface FinalizarShowFormProps {
  onCancel?: () => void;
  initialValues: {
    $id: string;
    valor: number;
    contratante: Contratante;
    local: Locais;
    equipe: Equipe[];
  };
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const currencyParser = (value: string) => {
  return Number(value.replace(/\D/g, "")) / 100;
};

export const FinalizarShowForm = ({
  onCancel,
  initialValues,
}: FinalizarShowFormProps) => {
  const { mutate, isPending } = useCreateFaturamento();

  const form = useForm<z.infer<typeof createFaturamentoSchema>>({
    resolver: zodResolver(createFaturamentoSchema),
    defaultValues: {
      show_id: initialValues.$id,
      valor: initialValues.valor,
      valor_recebido: initialValues.valor,
      data_pagamento: new Date(),
      despesa_musicos: initialValues.equipe.map((membro) => ({
        $id: membro.$id || "",
        nome: membro.nome || "",
        valor: parseInt(membro.cache_medio) || 0,
      })),
      despesas: [{ descricao: "", valor: 0 }],
    },
  });

  const { fields: membros } = useFieldArray({
    control: form.control,
    name: "despesa_musicos",
  });

  const {
    fields: despesas,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "despesas",
  });

  const despesasM =
    useWatch({ control: form.control, name: "despesa_musicos" }) || [];
  const despesasG = useWatch({ control: form.control, name: "despesas" }) || [];

  const totalDespesas =
    despesasM.reduce((acc: number, item: any) => acc + (item.valor || 0), 0) +
    despesasG.reduce((acc: number, item: any) => acc + (item.valor || 0), 0);

  useEffect(() => {
    form.setValue("valor_despesas", totalDespesas);
  }, [totalDespesas]);

  const onSubmit = (values: z.infer<typeof createFaturamentoSchema>) => {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader>
        <CardTitle>Finalizar show</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <DottedSeparator />

            <div className="grid grid-cols-4 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem className="col-span-2 lg:col-span-1">
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={
                          field.value
                            ? currencyFormatter.format(Number(field.value))
                            : ""
                        }
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valor_recebido"
                render={({ field }) => (
                  <FormItem className="col-span-2 lg:col-span-1">
                    <FormLabel>Valor recebido</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={
                          field.value
                            ? currencyFormatter.format(Number(field.value))
                            : ""
                        }
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          const numericValue = currencyParser(rawValue);
                          field.onChange(numericValue);
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data_pagamento"
                render={({ field }) => (
                  <FormItem className="col-span-4 lg:col-span-1">
                    <FormLabel>Data pagamento</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        granularity="day"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        displayFormat={{ hour24: "dd/MM/yyyy" }}
                        placeholder="Selecione uma data"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DottedSeparator className="my-2" />

            <CardDescription>Despesas da equipe</CardDescription>

            {membros.map((musico, index) => (
              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center"
                key={musico.id}
              >
                <FormField
                  control={form.control}
                  name={`despesa_musicos.${index}.nome`}
                  render={({ field }) => (
                    <FormItem className="col-span-1 lg:col-span-2">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`despesa_musicos.${index}.valor`}
                  render={({ field }) => (
                    <FormItem className="col-span-1 lg:col-span-1">
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={
                            field.value
                              ? currencyFormatter.format(Number(field.value))
                              : ""
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            const numericValue = currencyParser(rawValue);
                            field.onChange(numericValue);
                          }}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <DottedSeparator className="my-2" />

            <CardDescription>Despesas da gerais</CardDescription>

            {despesas.map((despesa, index) => (
              <div className="flex gap-4" key={despesa.id}>
                <FormField
                  control={form.control}
                  name={`despesas.${index}.descricao`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Transporte, Alimentação..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`despesas.${index}.valor`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={
                            field.value
                              ? currencyFormatter.format(Number(field.value))
                              : ""
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            const numericValue = currencyParser(rawValue);
                            field.onChange(numericValue);
                          }}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 items-end mb-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => append({ descricao: "", valor: 0 })}
                  >
                    <CirclePlus />
                  </Button>
                </div>
              </div>
            ))}

            <DottedSeparator className="my-2" />

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
                {isPending ? "Aguarde..." : "Finalizar show"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
