import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/date-time-picker";

import { createProjetosFinanceSchema } from "../schemas";
import {
  ProjetosCategorias,
  ProjetosFinanceFormaPagamento,
  ProjetosFinanceStatus,
  ProjetosFinanceTipo,
} from "../types";
import { useCreateProjetosFinance } from "../api/use-create-projetos-finance";

interface CreateProjetosFinanceFormProps {
  onCancel?: () => void;
  projetoId: string;
  categorias: ProjetosCategorias[];
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const currencyParser = (value: string) => {
  return Number(value.replace(/\D/g, "")) / 100;
};

export const CreateProjetosFinanceForm = ({
  onCancel,
  projetoId,
  categorias,
}: CreateProjetosFinanceFormProps) => {
  const { mutate, isPending } = useCreateProjetosFinance();

  const form = useForm<z.infer<typeof createProjetosFinanceSchema>>({
    resolver: zodResolver(createProjetosFinanceSchema),
    defaultValues: {
      projeto_id: projetoId,
      tipo: "ENTRADA",
      status: "PAGO",
      valor: 0,
      data: new Date(),
      forma_pagamento: "",
      descricao: "",
      obecervacoes: "",
      categoria: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createProjetosFinanceSchema>) => {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader>
        <CardTitle>Criar novo movimento</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DottedSeparator />

            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem className="col-span-3 lg:col-span-1">
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(ProjetosFinanceTipo).map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
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
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-3 lg:col-span-1">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(ProjetosFinanceStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
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
                name="data"
                render={({ field }) => (
                  <FormItem className="col-span-3 lg:col-span-1">
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
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="valor"
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
              <FormField
                control={form.control}
                name="forma_pagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de pagamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a forma de pagamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(ProjetosFinanceFormaPagamento).map(
                          (pagamento) => (
                            <SelectItem key={pagamento} value={pagamento}>
                              {pagamento.replace("_", " ")}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem
                            key={categoria.$id}
                            value={categoria.nome}
                          >
                            {categoria.nome}
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
              name="obecervacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Obcervações</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
              <Button size="lg" type="submit" disabled={isPending}>
                {isPending ? "Aguarde..." : "Criar movimento"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
