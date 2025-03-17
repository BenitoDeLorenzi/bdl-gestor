"use client";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { mask, unmask } from "remask";
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
import { useCreateUsuarios } from "../api/use-create-usuarios";
import { createUsuariosSchema } from "../schemas";
import { toast } from "sonner";

interface CreateUsuariosFormProps {
  onCancel?: () => void;
}

export const CreateUsuariosForm = ({ onCancel }: CreateUsuariosFormProps) => {
  const { mutate, isPending } = useCreateUsuarios();
  const form = useForm({
    resolver:
      zodResolver<z.infer<typeof createUsuariosSchema>>(createUsuariosSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createUsuariosSchema>) => {
    mutate(
      { json: values },
      {
        onSuccess: (data) => {
          if (!data.success) {
            const code = data.error?.code;

            console.log(data);

            if (code === 400) {
              form.setError("phone", {
                message:
                  "Parâmetro `telefone` inválido: O número de telefone deve começar com '+' e pode ter no máximo quinze dígitos.",
              });
            }

            if (code === 401) {
              toast.error("Não autorizado");
            }

            if (code === 409) {
              form.setError("email", {
                message: "Já existe um usuário com o mesmo e-mail.",
              });
            }
          } else {
            form.reset();
            onCancel?.();
          }
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle>Cria novo usuário</CardTitle>
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
              name="name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      onChange={(e) => {
                        const patterns = ["(99) 9999-9999", "(99) 99999-9999"];
                        field.onChange(mask(unmask(e.target.value), patterns));
                      }}
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
