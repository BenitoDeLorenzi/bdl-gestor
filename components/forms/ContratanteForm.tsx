/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { estados, tipoContratanteData } from "@/utils/data";
import { Button } from "../ui/button";
import { CirclePlus, Loader2, RefreshCcw } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  contratanteSchema,
  ContratanteSchema,
} from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createContratante, updateContratante } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

const ContratanteForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ContratanteSchema>({
    resolver: zodResolver(contratanteSchema),
    defaultValues: {
      id: data?.id || "",
      nome: data?.nome || "",
      contato: data?.contato || "",
      cidade: data?.cidade || "",
      estado: data?.estado || "SC",
      endereco: data?.endereco || "",
      telefone: data?.telefone || "",
      email: data?.email || "",
      tipo: data?.tipo || "",
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createContratante : updateContratante,
    {
      success: false,
      error: false,
    }
  );

  function onSubmit(data: ContratanteSchema) {
    setLoading(true);
    console.log(data);
    formAction(data);
  }

  useEffect(() => {
    if (state.success) {
      toast({
        variant: "default",
        title: `Contratante foi ${
          type === "create" ? "criado" : "atualizado"
        } com sucesso!`,
      });
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  }, [state]);

  return (
    <DialogContent className="max-w-sm md:max-w-2xl" aria-describedby="">
      <DialogHeader>
        <DialogTitle>{`${
          type === "create" ? "Criar" : "Atualizar"
        } contratante`}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ">
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
            <FormField
              control={form.control}
              name="contato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de contato</FormLabel>
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
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipoContratanteData.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 ">
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estados.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
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
            name="endereco"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-2">
            {loading ? (
              <Button disabled>
                {type === "create" ? "Criando" : "Atualizando"}
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button type="submit">
                {type === "create" ? "Criar" : "Atualizar"}
                {type === "create" ? <CirclePlus /> : <RefreshCcw />}
              </Button>
            )}
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ContratanteForm;
