"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateShowModal } from "../hooks/use-create-show-modal";
import { CreateShowFormWrapper } from "./create-show-form-wrapper";

export const CreateShowModal = () => {
  const { isOpen, setIsOpen, close } = useCreateShowModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateShowFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
