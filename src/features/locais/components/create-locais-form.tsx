"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Estado } from "@/features/shows/api/use-get-ufs";
import { createLocaisSchema } from "../schemas";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DottedSeparator from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mask, unmask } from "remask";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLocais } from "../api/use-create-locais";
import { useEffect } from "react";
import { useGetCep } from "../hooks/use-get-cep";
import { Tipos } from "@/features/tipos/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateLocaisFormProps {
  onCancel: () => void;
  ufs: Estado[];
  locaisOpt: Tipos[];
}

export const CreateLocaisForm = ({
  onCancel,
  ufs,
  locaisOpt,
}: CreateLocaisFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateLocais();

  const form = useForm<z.infer<typeof createLocaisSchema>>({
    resolver: zodResolver(createLocaisSchema),
    defaultValues: {
      nome: "",
      tipo: "",
      cep: "",
      uf: "SC",
      cidade: "",
      logradouro: "",
      numero: "",
      anotacoes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createLocaisSchema>) => {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          form.reset();
        },
        onError: (error) => {
          if (
            error.message.includes("plano") ||
            error.message.includes("Plano")
          ) {
            onCancel?.();
            toast.warning(error.message, {
              duration: Infinity,
              action: {
                label: "Planos",
                onClick: () => {
                  router.push("/planos");
                },
              },
            });
          } else {
            toast.error(error.message);
          }
        },
      }
    );
  };

  const cep = form.watch("cep");

  useEffect(() => {
    const fetchCep = async (cep: string) => {
      const response = await useGetCep({ cep: cep });

      if (response) {
        form.setValue("cidade", response.localidade);
        form.setValue("uf", response.uf);
        form.setValue(
          "logradouro",
          `${response.logradouro} ${response.bairro && `, ${response.bairro}`}`
        );
        form.setValue("anotacoes", response.complemento);
      }
    };

    if (cep.length === 9) {
      fetchCep(cep);
    }
  }, [cep]);

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader>
        <CardTitle>Criar novo local</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DottedSeparator />

            <div className="grid grid-cols-2 gap-2 lg:gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="col-span-2 lg:col-span-1">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem className="col-span-2 lg:col-span-1">
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locaisOpt.map((locais: Tipos) => (
                          <SelectItem key={locais.$id} value={locais.nome}>
                            {locais.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-7 gap-2">
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem className="col-span-3 lg:col-span-2">
                    <FormLabel>Cep</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const patterns = ["99999-999"];
                          field.onChange(
                            mask(unmask(e.target.value), patterns)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="uf"
                render={({ field }) => (
                  <FormItem className="col-span-4 lg:col-span-2">
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ufs.map((uf) => (
                          <SelectItem key={uf.sigla} value={uf.sigla}>
                            {uf.nome}
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
                name="cidade"
                render={({ field }) => (
                  <FormItem className="col-span-7 lg:col-span-3">
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 lg:gap-4">
              <FormField
                control={form.control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem className="col-span-2 ">
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem className="col-span-1 ">
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      placeholder="Informações diversas"
                      className="resize-none"
                      {...field}
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
                {isPending ? "Aguarde..." : "Criar local"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
