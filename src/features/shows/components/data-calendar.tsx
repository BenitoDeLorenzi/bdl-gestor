"use client";

import { useState } from "react";

import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";

import { Shows } from "../types";
import { title } from "process";
import { EventCard } from "./event-card";
import { CustomToolbar } from "./custom-toolbar";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }), // Domingo como início da semana
  getDay,
  locales,
});

interface DataCalendarProps {
  data: Shows[];
}

export const DataCalendar = ({ data }: DataCalendarProps) => {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].data) : new Date()
  );

  const events = data.map((show) => ({
    start: new Date(show.data),
    end: new Date(show.data),
    title: typeof show.local === "string" ? show.local : show.local.nome,
    contratante:
      typeof show.contratante === "string"
        ? show.contratante
        : show.contratante.nome,
    horario: format(new Date(show.horario), "HH:mm"),
    status: show.status,
    id: show.$id,
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      culture="pt-BR"
      messages={{
        today: "Hoje",
        previous: "Anterior",
        next: "Próximo",
        month: "Mês",
        week: "Semana",
        day: "Dia",
        agenda: "Agenda",
        noEventsInRange: "Nenhum evento neste período.",
      }}
      formats={{
        dateFormat: "dd",
        dayFormat: (date) => format(date, "EEEE", { locale: ptBR }), // Nome do dia da semana
        weekdayFormat: (date) => format(date, "EEE", { locale: ptBR }), // Abreviação do dia da semana
        timeGutterFormat: (date) => format(date, "HH:mm", { locale: ptBR }), // Formato das horas
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            status={event.status}
            horario={event.horario}
            contratante={event.contratante}
          />
        ),
        toolbar: () => (
          <CustomToolbar date={value} onNavigate={handleNavigate} />
        ),
      }}
    />
  );
};
