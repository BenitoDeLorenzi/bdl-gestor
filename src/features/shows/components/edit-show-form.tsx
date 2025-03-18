"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";

import { createShowsSchema } from "../schemas";

import DottedSeparator from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/multi-select";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Show, Shows } from "../types";
import { DateTimePicker, TimePicker } from "@/components/date-time-picker";
import { format, isValid, parseISO } from "date-fns";
import { useUpdateShow } from "../api/use-update-show";
import { Tipos } from "@/features/tipos/types";

interface EditShowsFormProps {
  onCancel?: () => void;
  contratanteOptions: { id: string; nome: string }[];
  equipeOptions: { id: string; nome: string }[];
  locaisOptions: { id: string; nome: string }[];
  initialValues: Shows;
  projetosOptions: Tipos[];
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const currencyParser = (value: string) => {
  return Number(value.replace(/\D/g, "")) / 100;
};

export const EditShowForm = ({
  onCancel,
  contratanteOptions,
  equipeOptions,
  locaisOptions,
  initialValues,
  projetosOptions,
}: EditShowsFormProps) => {
  const { mutate, isPending } = useUpdateShow();

  const form = useForm<z.infer<typeof createShowsSchema>>({
    resolver: zodResolver(createShowsSchema),
    defaultValues: {
      ...initialValues,
      data: initialValues.data ? new Date(initialValues.data) : undefined,
      horario: initialValues.horario
        ? new Date(initialValues.horario)
        : undefined,
      valor: initialValues.valor,
      status: initialValues.status,
      contratante:
        typeof initialValues.contratante === "string"
          ? initialValues.contratante
          : initialValues.contratante.$id,
      local:
        typeof initialValues.local === "string"
          ? initialValues.local
          : initialValues.local.$id,
      equipe: initialValues.equipe.map((membro) => {
        if (typeof membro === "string") {
          return membro;
        } else {
          return membro.$id;
        }
      }),
      projeto: initialValues.projeto,
    },
  });

  const onSubmit = (values: z.infer<typeof createShowsSchema>) => {
    const formatDate = (date: string | Date) => {
      if (typeof date === "string") {
        const parsedDate = parseISO(date);
        return isValid(parsedDate)
          ? format(parsedDate, "yyyy-MM-dd'T'HH:mm:ssxxx")
          : date;
      }
      return format(date, "yyyy-MM-dd'T'HH:mm:ssxxx");
    };

    const dataToSave = {
      ...values,
      data: formatDate(values.data),
      horario: formatDate(values.horario),
    };

    console.log("Enviando para API:", dataToSave);

    mutate(
      { json: dataToSave, param: { showId: initialValues.$id } },
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
        <CardTitle>Editar show</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DottedSeparator />

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-1 lg:col-span-1">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um contratante" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDENTE">PENDENTE</SelectItem>
                        <SelectItem value="CONFIRMADO">CONFIRMADO</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem className="col-span-1.5 lg:col-span-1">
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
              <FormField
                control={form.control}
                name="projeto"
                render={({ field }) => (
                  <FormItem className="col-span-2 lg:col-span-1">
                    <FormLabel>Projeto</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um projeto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projetosOptions.map((projeto) => (
                            <SelectItem key={projeto.nome} value={projeto.nome}>
                              {projeto.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contratante"
                render={({ field }) => (
                  <FormItem className="col-span-2 lg:col-span-1">
                    <FormLabel>Contratante</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um contratante" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contratanteOptions.map((contratante) => (
                          <SelectItem
                            key={contratante.id}
                            value={contratante.id}
                          >
                            {contratante.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem className="col-span-2 lg:col-span-1">
                    <FormLabel>Local</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um local" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locaisOptions.map((local) => (
                          <SelectItem key={local.id} value={local.id}>
                            {local.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="equipe"
              render={({ field }) => (
                <FormItem className="col-span-2 lg:col-span-1">
                  <FormLabel>Equipe</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      options={equipeOptions.map((membro) => ({
                        value: membro.id,
                        label: membro.nome,
                      }))}
                      value={
                        Array.isArray(field.value)
                          ? field.value.map((id) => {
                              const membro = equipeOptions.find(
                                (m) => m.id === id
                              );
                              return membro
                                ? { value: membro.id, label: membro.nome }
                                : { value: id, label: "Desconhecido" };
                            })
                          : []
                      }
                      onChange={(items) => {
                        const membrosSelecionados = items.map(
                          (item) => item.value
                        );
                        field.onChange(membrosSelecionados);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="col-span-2 lg:col-span-1">
                    <FormLabel>Data</FormLabel>
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
              <FormField
                control={form.control}
                name="horario"
                render={({ field }) => (
                  <FormItem className="col-span-2 lg:col-span-1">
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <TimePicker
                        hourCycle={24}
                        date={field.value}
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="anotacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anotações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações diversas, conta bancaria e etc..."
                      className="resize-none"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DottedSeparator />

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
                {isPending ? "Aguarde..." : "Atualizar show"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
