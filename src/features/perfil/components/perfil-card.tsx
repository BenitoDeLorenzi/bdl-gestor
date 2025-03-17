"use client";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import React from "react";
import { useFormContext, Path } from "react-hook-form";

interface PerfilCardProps<T extends Record<string, any>> {
  formField: Path<T>;
  title: string;
  description?: string;
  disabled: boolean;
  onSubmit: (data: T) => void;
  isLoading: boolean;
}

export const PerfilCard = <T extends Record<string, any>>({
  formField,
  title,
  description,
  disabled,
  onSubmit,
  isLoading,
}: PerfilCardProps<T>) => {
  const form = useFormContext<T>();

  if (!form) {
    throw new Error("PerfilCard deve estar dentro de um FormProvider!");
  }

  return (
    <Card>
      <CardContent className="p-5">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <div className="flex flex-col justify-center gap-2">
              <FormField
                control={form.control}
                name={formField}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{title}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={formField === "password" ? "password" : "text"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DottedSeparator className="py-4" />
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={disabled || isLoading}>
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <Loader className="animate-spin" />
                  <span>Aguarde...</span>
                </div>
              ) : (
                "Atualizar"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
