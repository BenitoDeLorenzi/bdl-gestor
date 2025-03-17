import React, { useCallback, useEffect, useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import { Shows, ShowStatus } from "../types";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

const boards: ShowStatus[] = [
  ShowStatus.PENDENTE,
  ShowStatus.CONFIRMADO,
  ShowStatus.FINALIZADO,
];

type ShowsState = {
  [key in ShowStatus]: Shows[];
};

interface DataKanbanProps {
  data: Shows[];
  onChange: (shows: { $id: string; status: ShowStatus }[]) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [shows, setShows] = useState<ShowsState>(() => {
    const initialShows: ShowsState = {
      [ShowStatus.CONFIRMADO]: [],
      [ShowStatus.FINALIZADO]: [],
      [ShowStatus.PENDENTE]: [],
    };

    data.forEach((show) => {
      initialShows[show.status].push(show);
    });

    return initialShows;
  });

  useEffect(() => {
    const newShows: ShowsState = {
      [ShowStatus.CONFIRMADO]: [],
      [ShowStatus.FINALIZADO]: [],
      [ShowStatus.PENDENTE]: [],
    };

    data.forEach((show) => {
      newShows[show.status].push(show);
    });

    setShows(newShows);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) result;

      const { source, destination } = result;

      const sourceStatus = source.droppableId as ShowStatus;
      const destStatus = destination?.droppableId as ShowStatus;

      let updatesPayLoad: {
        $id: string;
        status: ShowStatus;
      }[] = [];

      setShows((prevShows) => {
        const newShows = { ...prevShows };

        const sourceColumn = [...newShows[sourceStatus]];
        const [movedShow] = sourceColumn.splice(source.index, 1);

        if (!movedShow) {
          console.error("Nenhum show encontrado.");
          return prevShows;
        }

        const updatedShow =
          sourceStatus !== destStatus
            ? { ...movedShow, status: destStatus }
            : movedShow;

        newShows[sourceStatus] = sourceColumn;

        const destColumn = [...newShows[destStatus]];
        destColumn.splice(destination?.index || 0, 0, updatedShow);
        newShows[destStatus] = destColumn;

        updatesPayLoad = [];

        updatesPayLoad.push({ $id: updatedShow.$id, status: destStatus });

        return newShows;
      });

      onChange(updatesPayLoad);
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                showCount={shows[board].length}
              />

              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {shows[board].map((show, index) => (
                      <Draggable
                        key={show.$id}
                        draggableId={show.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className=""
                          >
                            <KanbanCard show={show} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
