"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEquipeSchema } from "../schemas";
import { mask, unmask } from "remask";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import DottedSeparator from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateEquipe } from "../api/use-create-equipe";
import { Tipos } from "@/features/tipos/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateEquipeFormProps {
  onCancel?: () => void;
  funcoesOpt: Tipos[];
  instrumentosOpt: Tipos[];
}

export const CreateEquipeForm = ({
  onCancel,
  funcoesOpt,
  instrumentosOpt,
}: CreateEquipeFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateEquipe();

  const form = useForm({
    resolver:
      zodResolver<z.infer<typeof createEquipeSchema>>(createEquipeSchema),
    defaultValues: {
      nome: "",
      funcao: "",
      instrumento: "",
      telefone: "",
      email: "",
      cache_medio: "",
      chave_pix: "",
      anotacoes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createEquipeSchema>) => {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
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

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle>Cria novo membro da equipe.</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
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

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="funcao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {funcoesOpt.map((funcao) => (
                          <SelectItem key={funcao.nome} value={funcao.nome}>
                            {funcao.nome}
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
                name="instrumento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instrumento</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um instrumento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {instrumentosOpt.map((instrumento) => (
                          <SelectItem
                            key={instrumento.nome}
                            value={instrumento.nome}
                          >
                            {instrumento.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-5 gap-2">
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const patterns = ["99 9999-9999", "99 99999-9999"];
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
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="cache_medio"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Cachê médio</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chave_pix"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Chave pix</FormLabel>
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
                {isPending ? "Aguarde..." : "Criar membro"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
