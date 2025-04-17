"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { CreateTiposForm } from "./create-tipos-form";
import { useCreateTiposModal } from "../hooks/use-create-tipos-modal";
import { usePathname } from "next/navigation";

export const CreateTiposModal = () => {
  const { isOpen, setIsOpen, close } = useCreateTiposModal();
  const pathname = usePathname();
  const tipo = pathname.split("/")[3];

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      {tipo && <CreateTiposForm onCancel={close} tipo={tipo} />}
    </ResponsiveModal>
  );
};
