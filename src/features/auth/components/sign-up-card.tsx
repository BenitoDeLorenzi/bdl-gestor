"use client";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Link from "next/link";
import { useRegister } from "../api/use-register";
import { useState } from "react";

const SignUpCard = () => {
  const [error, setError] = useState("");
  const { mutate, isPending } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate(
      { json: values },
      {
        onSuccess: (data) => {
          if (!data.success) {
            console.log(data.error);
            const code = data.error?.code;

            if (code === 400) {
              form.setError("password", {
                message:
                  "A senha deve ter entre 8 e 265 caracteres e não deve ser uma das senhas comumente usadas.",
              });
            }
            if (code === 409) {
              form.setError("email", {
                message: "Já existe um usuário com o mesmo e-mail.",
              });
            }
          }
        },
      }
    );
  };

  return (
    <Card className="w-full h-full md:w-[487px]">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Registrar</CardTitle>
        <CardDescription>
          Ao se registrar, você concorda com nossas{" "}
          <Link href="/privacy" className="text-blue-700">
            <span>Polícia de Privacidade</span>
          </Link>{" "}
          e{" "}
          <Link href="/terms" className="text-blue-700">
            <span>Termos de Serviço</span>
          </Link>
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Insira seu nome"
                      {...field}
                      type="text"
                      disabled={isPending}
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
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Insira seu e-mail"
                      {...field}
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Insira sua senha"
                      {...field}
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Aguarde..." : "Registrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button variant="outline" size="lg" className="w-full" disabled={false}>
          <FcGoogle className="mr-2 size-5" />
          Entrar com Google
        </Button>
        <Button variant="outline" size="lg" className="w-full" disabled={false}>
          <FaFacebook className="mr-2 size-5" />
          Entrar com Facebook
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Já tem uma conta?{" "}
          <Link href="/sign-in">
            <span className="text-blue-700">Entrar</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
