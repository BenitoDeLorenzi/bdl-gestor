"use client";

import { JSX, useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "default",
  isLoading?: boolean
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promisse, setPromisse] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromisse({ resolve });
    });
  };

  const handleClose = () => {
    setPromisse(null);
  };

  const handleConfirm = () => {
    promisse?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promisse?.resolve(false);
    setPromisse(null);
  };

  const ConfirmationDialog = () => {
    return (
      <ResponsiveModal open={promisse !== null} onOpenChange={handleClose}>
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="pt-8">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full lg:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                variant={variant}
                className="w-full lg:w-auto"
                loading={isLoading}
              >
                Confirmar
              </Button>
            </div>
          </CardContent>
        </Card>
      </ResponsiveModal>
    );
  };

  return [ConfirmationDialog, confirm];
};
