"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
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
import { CirclePlus, Loader2, RefreshCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  faturamentoSchema,
  FaturamentoSchema,
} from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import {
  createFaturamento,
  createShow,
  updateFaturamento,
  updateShow,
} from "@/lib/actions";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";

const FaturamentoForm = ({
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

  const form = useForm<FaturamentoSchema>({
    resolver: zodResolver(faturamentoSchema),
    defaultValues: {
      id: data?.id || "",
      show_id: data?.id || relatedData?.id,
      contratante_id: data?.id || relatedData?.id,
      contratante_nome: data?.contratante_id || relatedData?.contratante.nome,
      data_show: data?.data_show || relatedData?.data_show,
      valor: data?.valor || relatedData?.valor,
      despesa_musicos:
        data?.despesa_musicos ||
        relatedData?.musicos?.map((musico: any) => ({
          id: musico.id,
          nome: musico.nome,
          valor: musico.cache_medio || 0,
        })) ||
        [],
      despesas: data?.despesas || [{ descricao: "", valor: 0 }],
      valor_final: data?.valorFinal || 0,
      valor_despesas: data?.valorTotalDespesas || 0,
    },
  });

  const { fields: musicos, update } = useFieldArray({
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

  const valorRecebido = useWatch({ control: form.control, name: "valor" }) || 0;
  const despesasM =
    useWatch({ control: form.control, name: "despesa_musicos" }) || [];
  const despesasG = useWatch({ control: form.control, name: "despesas" }) || [];

  const totalDespesas =
    despesasM.reduce((acc: number, item: any) => acc + (item.valor || 0), 0) +
    despesasG.reduce((acc: number, item: any) => acc + (item.valor || 0), 0);

  const valorFinalCalculado = valorRecebido - totalDespesas;

  useEffect(() => {
    form.setValue("valor_despesas", totalDespesas);
    form.setValue("valor_final", valorFinalCalculado);
  }, [totalDespesas, valorRecebido]);

  const [state, formAction] = useFormState(
    type === "create" ? createFaturamento : updateFaturamento,
    {
      success: false,
      error: false,
    }
  );

  async function onSubmit(data: FaturamentoSchema) {
    setLoading(true);
    console.log(data);
    formAction(data);
  }

  useEffect(() => {
    if (state.success) {
      toast({
        variant: "default",
        title: `Faturamento foi ${
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
        } faturamento`}</DialogTitle>
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

          <DialogDescription className="font-semibold">Show</DialogDescription>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="contratante_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contratante</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor recebido</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogDescription className="font-semibold">
            Musicos
          </DialogDescription>

          {musicos.map((musico, index) => (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
              key={musico.id}
            >
              <FormField
                control={form.control}
                name={`despesa_musicos.${index}.nome`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          form.setValue(
                            `despesa_musicos.${index}.valor`,
                            Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <DialogDescription className="font-semibold">
            Despesas
          </DialogDescription>

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
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          form.setValue(
                            `despesas.${index}.valor`,
                            Number(e.target.value)
                          )
                        }
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

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="valor_despesas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total de Despesas</FormLabel>
                  <FormControl>
                    <Input {...field} value={totalDespesas} disabled />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor_final"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Final</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={valorRecebido - totalDespesas}
                      disabled
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

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

export default FaturamentoForm;
