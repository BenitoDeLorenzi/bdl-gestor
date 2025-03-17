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
import { useCreateTipos } from "../api/use-create-tipos";

interface CreateTiposFormProps {
  onCancel: () => void;
  tipo: string;
}

const title: Record<string, string> = {
  locais: "Criar novo tipo de local",
  funcoes: "Criar novo tipo de função",
  instrumentos: "Criar novo tipo de instrumento",
  projetos: "Criar novo tipo de projeto",
};

export const CreateTiposForm = ({ onCancel, tipo }: CreateTiposFormProps) => {
  const { mutate, isPending } = useCreateTipos();
  const form = useForm({
    resolver: zodResolver<z.infer<typeof createTiposSchema>>(createTiposSchema),
    defaultValues: {
      nome: "",
      tipo: tipo,
    },
  });

  const onSubmit = (values: z.infer<typeof createTiposSchema>) => {
    mutate(
      { json: values },
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
        <CardTitle>{title[tipo]}</CardTitle>
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
