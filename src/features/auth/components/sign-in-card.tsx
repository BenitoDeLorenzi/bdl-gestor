"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DottedSeparator from "@/components/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginSchema } from "../schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { FcGoogle } from "react-icons/fc";
import { useLogin } from "../api/use-login";
import { useState } from "react";
import { signUpWithGoogle } from "@/lib/oauth";
import { ArrowRightIcon } from "lucide-react";

export const SignInCard = () => {
  const [error, setError] = useState("");
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setError("");
    mutate(
      { json: values },
      {
        onSuccess: (data) => {
          if (!data.success) {
            const code = data.error?.code;

            if (code === 400) {
              setError(
                "Parâmetro `password` inválido: a senha deve ter entre 8 e 256 caracteres."
              );
            }
            if (code === 401) {
              setError("Credenciais inválidas. Verifique o e-mail e a senha.");
            }
          }
        },
      }
    );
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-xl">Bem-vindo de volta!</CardTitle>
        <CardDescription className="text-red-500">{error}</CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Insira seu e-mail"
                      {...field}
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

            <Button
              className="w-full"
              size="lg"
              disabled={isPending}
              effect="gooeyLeft"
              icon={ArrowRightIcon}
              iconPlacement="right"
            >
              {isPending ? "Aguarde..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => signUpWithGoogle()}
          effect="ringHover"
        >
          <FcGoogle className="mr-2 size-5" />
          Entrar com Google
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Não tem uma conta?{" "}
          <Button variant="link" effect="hoverUnderline" asChild>
            <Link href="/sign-up">
              <span className="text-blue-700">Registrar</span>
            </Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
};
