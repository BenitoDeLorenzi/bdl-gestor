/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "@/hooks/use-toast";
import { createShow, updateShow } from "@/lib/actions";
import {
  MusicoSchema,
  showSchema,
  ShowSchema,
} from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { CirclePlus, Loader2, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Contratantes } from "@/app/(dashboard)/contratantes/page";
import { Input } from "../ui/input";
import MultipleSelector from "../multi-select";
import { tipoProjeto } from "@/utils/data";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";

const ShowForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ShowSchema>({
    resolver: zodResolver(showSchema),
    defaultValues: {
      id: data?.id || "",
      contratante: data?.contratante || null,
      local: data?.local || "",
      valor: data?.valor.toString() || "",
      musicos: data?.musicos || [],
      data_show: data?.data_show || "",
      horario_show: data?.horario_show || "",
      tipo_projeto: data?.tipo_projeto || "",
      descricao: data?.descricao || "",
      finalizado: data?.finalizado || false,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createShow : updateShow,
    {
      success: false,
      error: false,
    }
  );

  async function onSubmit(data: ShowSchema) {
    setLoading(true);
    formAction(data);
  }

  useEffect(() => {
    if (state.success) {
      toast({
        variant: "default",
        title: `Show foi ${
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
        } show`}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          {state.error && (
            <span className="text-sm font-semibold text-red-500">
              Algo deu errado
            </span>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <FormField
              control={form.control}
              name="finalizado"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center">
                  <FormLabel>Finalizado</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contratante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contratante</FormLabel>
                  <Select
                    onValueChange={(id) => {
                      const contratanteSelecionado =
                        relatedData.contratantes.find(
                          (item: Contratantes) => item.id === id
                        );
                      field.onChange(contratanteSelecionado || null);
                    }}
                    defaultValue={data?.contratante.id}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relatedData.contratantes.map((item: Contratantes) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.nome}
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
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
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
            name="musicos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Músicos</FormLabel>
                <FormControl>
                  <MultipleSelector
                    options={relatedData.musicos.map(
                      (musico: MusicoSchema) => ({
                        value: musico.id ?? "",
                        label: `${musico.nome} - ${musico.instrumento}`,
                      })
                    )}
                    value={
                      field.value
                        ? field.value.map((musico: MusicoSchema) => ({
                            value: musico.id ?? "",
                            label: `${musico.nome} - ${musico.instrumento}`,
                          }))
                        : []
                    }
                    onChange={(items) => {
                      const musicosSelecionados = items
                        .map((item) =>
                          relatedData.musicos.find(
                            (musico: MusicoSchema) => musico.id === item.value
                          )
                        )
                        .filter(Boolean);
                      field.onChange(musicosSelecionados);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <FormField
              control={form.control}
              name="data_show"
              render={({ field }) => (
                <FormItem className="col-span-3 md:col-span-1">
                  <FormLabel>Data do Show</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="horario_show"
              render={({ field }) => (
                <FormItem className="col-span-3 md:col-span-1">
                  <FormLabel>Horário do Show</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo_projeto"
              render={({ field }) => (
                <FormItem className="col-span-3 md:col-span-1">
                  <FormLabel>Tipo projeto</FormLabel>
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
                      {tipoProjeto.map((item) => (
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
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
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

export default ShowForm;
