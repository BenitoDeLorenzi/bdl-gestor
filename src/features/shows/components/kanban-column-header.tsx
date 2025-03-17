import { snakeCaseToTitleCase } from "@/lib/utils";
import { ShowStatus } from "../types";
import React from "react";
import {
  CircleCheckIcon,
  CircleDotDashedIcon,
  CirclePlayIcon,
  ClockIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateShowModal } from "../hooks/use-create-show-modal";

interface KanbanColumnHeaderProps {
  board: ShowStatus;
  showCount: number;
}

const statusIconMap: Record<ShowStatus, React.ReactNode> = {
  [ShowStatus.PENDENTE]: <ClockIcon className="size-[18px] text-amber-400" />,
  [ShowStatus.CONFIRMADO]: (
    <CircleDotDashedIcon className="size-[18px] text-blue-400" />
  ),
  [ShowStatus.FINALIZADO]: (
    <CircleCheckIcon className="size-[18px] text-green-400" />
  ),
};

export const KanbanColumnHeader = ({
  board,
  showCount,
}: KanbanColumnHeaderProps) => {
  const { open } = useCreateShowModal();
  const icon = statusIconMap[board];
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {showCount}
        </div>
      </div>

      <Button onClick={open} variant="ghost" size="icon">
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
