"use client";

import { useEffect, useState } from "react";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import moment from "moment";
import { Shows } from "@/app/(dashboard)/shows/page";
import { Ellipsis, Music } from "lucide-react";

const ShowsCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [shows, setShows] = useState<Shows[]>([]);

  const fetchShows = async () => {
    const q = query(
      collection(db, "shows"),
      where("data_show", "==", moment(date).format("YYYY-MM-DD"))
    );
    const querySnapShot = await getDocs(q);
    const data: Shows[] = querySnapShot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Shows[];

    setShows(data);
  };

  useEffect(() => {
    fetchShows();
  }, [date]);

  return (
    <Card className="flex flex-col">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="h-full w-full flex"
        classNames={{
          months:
            "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
          month: "space-y-4 w-full flex flex-col",
          table: "w-full h-full border-collapse space-y-1",
          head_row: "",
          row: "w-full mt-2",
        }}
      />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className=" flex items-center justify-center gap-2">
            <Music />
            <h1 className="text-lg font-semibold">Shows</h1>
          </div>
          <Ellipsis />
        </div>
        {shows.map((show) => (
          <div
            key={show.id}
            className="flex flex-col p-3 rounded-md border-2 border-zinc-400 border-t-4 odd:border-t-[#82ca9d] even:border-t-[#8884d8] gap-2"
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-zinc-600">
                {show.contratante.nome}
              </h1>
              <span className="text-sm text-zinc-500">{`${moment(
                show.data_show,
                "YYYY-MM-DD"
              ).format("DD-MM-YYYY")} ás ${show.horario_show}`}</span>
            </div>
            <span className="text-xs font-semibold text-zinc-600">{`Local: ${show.local}`}</span>
            <div className="flex gap-4 flex-wrap">
              <span className="text-xs font-semibold text-zinc-600">{`Cidade: ${show.contratante.cidade} / ${show.contratante.estado}`}</span>
              <span className="text-xs font-semibold text-zinc-600">{`Projeto: ${show.tipo_projeto}`}</span>
            </div>
            <div className="flex justify-end">
              <span className="text-xs font-semibold text-zinc-600">{`${Intl.NumberFormat(
                "pt-BR",
                { style: "currency", currency: "BRL" }
              ).format(show.valor)}`}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ShowsCalendar;
