import { z } from "zod";
import { Hono } from "hono";
import { createFaturamentoSchema, createShowsSchema } from "../schemas";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import axios from "axios";

import { ID, Query } from "node-appwrite";
import {
  CONTRATANTES_ID,
  DATABASE_ID,
  EQUIPE_ID,
  FATURAMENTOS_ID,
  LOCAIS_ID,
  SHOWS_ID,
} from "@/config";

import { Show, Shows, ShowStatus } from "../types";
import { Equipe } from "@/features/equipe/types";
import { Contratante } from "@/features/contratantes/types";
import { Locais } from "@/features/locais/types";
import { addDays, endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { getCurrent } from "@/features/auth/queries";
import { getValidGoogleAccessToken } from "@/lib/getValidGoogleAccessToken";
import { formatCurrency } from "@/lib/utils";
import { planMiddleware } from "@/lib/plan-middleware";

interface ShowAnalytics {
  pendenteShowsCount: number;
  pendenteShowsDifference: number;
  confirmadoShowsCount: number;
  confirmadoShowsDifference: number;
  finalizadoShowsCount: number;
  finalizadoShowsDifference: number;
}

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        contratanteId: z.string(),
        status: z.nativeEnum(ShowStatus).nullish(),
        search: z.string().nullish(),
        ano: z.string().nullish(),
        local: z.string().nullish(),
        projeto: z.string().nullish(),
        page: z.string(),
        totalItems: z.string(),
      })
    ),
    async (c) => {
      const user = await getCurrent();
      const databases = c.get("databases");
      const {
        status,
        contratanteId,
        search,
        ano,
        local,
        projeto,
        page,
        totalItems,
      } = c.req.valid("query");

      const offSet = (parseInt(page) - 1) * parseInt(totalItems);
      const limit = parseInt(totalItems);

      const startDate = new Date(parseInt(ano || ""), 0, 1);
      const endDate = new Date(parseInt(ano || ""), 11, 31);

      const query = [
        Query.orderDesc("data"),
        Query.orderDesc("horario"),
        Query.limit(limit),
        Query.offset(offSet),
        Query.equal("user_id", user?.$id || ""),
      ];

      if (contratanteId) query.push(Query.equal("contratante", contratanteId));
      if (local) query.push(Query.equal("local", local));
      if (ano)
        query.push(
          Query.greaterThanEqual("data", startDate.toDateString()),
          Query.lessThanEqual("data", endDate.toDateString())
        );
      if (status) query.push(Query.equal("status", status));
      if (search) query.push(Query.search("nome", search));
      if (projeto) query.push(Query.equal("projeto", projeto));

      const shows = await databases.listDocuments<Shows>(
        DATABASE_ID,
        SHOWS_ID,
        query
      );

      const equipeIds = shows.documents.flatMap((show) =>
        Array.isArray(show.equipe)
          ? show.equipe.map((membro) =>
              typeof membro === "string" ? membro : membro.$id
            )
          : []
      );

      const contratantesIds = shows.documents
        .map((show) =>
          typeof show.contratante === "string"
            ? show.contratante
            : show.contratante?.$id
        )
        .filter(Boolean) as string[];

      const locaisIds = shows.documents
        .map((show) =>
          typeof show.local === "string" ? show.local : show.local?.$id
        )
        .filter(Boolean) as string[];

      const equipeDocs = await databases.listDocuments<Equipe>(
        DATABASE_ID,
        EQUIPE_ID,
        equipeIds.length > 0
          ? [Query.contains("$id", equipeIds), Query.limit(10000)]
          : []
      );

      const contratanteDocs = await databases.listDocuments<Contratante>(
        DATABASE_ID,
        CONTRATANTES_ID,
        contratantesIds.length > 0
          ? [Query.contains("$id", contratantesIds), Query.limit(10000)]
          : []
      );

      const locaisDocs = await databases.listDocuments<Locais>(
        DATABASE_ID,
        LOCAIS_ID,
        locaisIds.length > 0
          ? [Query.contains("$id", locaisIds), Query.limit(10000)]
          : []
      );

      const populatedShows: Shows[] = shows.documents.map((show) => {
        return {
          ...show,
          equipe: Array.isArray(show.equipe)
            ? show.equipe
                .map((id) =>
                  typeof id === "string"
                    ? equipeDocs.documents.find(
                        (membro) => membro.$id === id
                      ) ?? null
                    : id
                )
                .filter((membro): membro is Equipe => membro !== null)
            : [],

          contratante:
            typeof show.contratante === "string"
              ? contratanteDocs.documents.find(
                  (c) => c.$id === show.contratante
                ) ?? show.contratante
              : show.contratante,

          local:
            typeof show.local === "string"
              ? locaisDocs.documents.find((c) => c.$id === show.local) ??
                show.local
              : show.local,
        };
      });

      return c.json({ data: { ...shows, documents: populatedShows } });
    }
  )
  .get("/:showId", sessionMiddleware, async (c) => {
    const { showId } = c.req.param();
    const databases = c.get("databases");

    const show = await databases.getDocument<Shows>(
      DATABASE_ID,
      SHOWS_ID,
      showId
    );

    const contratante = await databases.getDocument<Contratante>(
      DATABASE_ID,
      CONTRATANTES_ID,
      typeof show.contratante === "string"
        ? show.contratante
        : show.contratante.$id
    );

    const local = await databases.getDocument<Locais>(
      DATABASE_ID,
      LOCAIS_ID,
      typeof show.local === "string" ? show.local : show.local.$id
    );

    const equipeIds = Array.isArray(show.equipe)
      ? show.equipe.map((membro) =>
          typeof membro === "string" ? membro : membro.$id
        )
      : [];

    const equipe = await databases.listDocuments<Equipe>(
      DATABASE_ID,
      EQUIPE_ID,
      equipeIds.length > 0 ? [Query.contains("$id", equipeIds)] : []
    );

    return c.json({
      data: {
        ...show,
        contratante: contratante,
        local: local,
        equipe: equipe.documents,
      },
    });
  })
  .post(
    "/",
    sessionMiddleware,
    planMiddleware,
    zValidator("json", createShowsSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const show = await databases.createDocument(
        DATABASE_ID,
        SHOWS_ID,
        ID.unique(),
        { ...values, user_id: user?.$id }
      );

      const accessToken = await getValidGoogleAccessToken(
        user.$id,
        user.prefs as {
          googleAccessToken: string;
          googleRefreshToken: string;
          googleTokenExpiry: string;
        }
      );

      if (accessToken) {
        try {
          const contratante = await databases.getDocument<Contratante>(
            DATABASE_ID,
            CONTRATANTES_ID,
            values.contratante
          );

          const local = await databases.getDocument<Locais>(
            DATABASE_ID,
            LOCAIS_ID,
            values.local
          );

          const startDate = format(values.data, "yyyy-MM-dd");
          const endDate = format(addDays(values.data, 1), "yyyy-MM-dd");
          const description = `Contratante: ${
            contratante.nome
          }<br>Valor: ${formatCurrency(values.valor)}<br>Projeto: ${
            values.projeto
          }<br>Horário: ${format(values.horario, "HH:mm")}`;

          const response = await axios.post(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            {
              summary: local.nome || "Show sem título",
              description: description || "Evento criado via BDL Gestor",
              start: { date: startDate },
              end: { date: endDate },
              colorId: "5", // 🔥 Ex: laranja
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const googleEvent = response.data;

          await databases.updateDocument(DATABASE_ID, SHOWS_ID, show.$id, {
            google_event_id: googleEvent.id,
          });
        } catch (error) {
          console.error("Erro ao criar evento no Google Calendar:", error);
        }
      }

      return c.json({ data: show });
    }
  )
  .patch(
    "/:showId",
    sessionMiddleware,
    zValidator("json", createShowsSchema.partial()),
    async (c) => {
      const { showId } = c.req.param();
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const show = await databases.updateDocument(
        DATABASE_ID,
        SHOWS_ID,
        showId,
        values
      );

      return c.json({ data: show });
    }
  )
  .delete("/:showId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { showId } = c.req.param();

    const show = await databases.getDocument<Show>(
      DATABASE_ID,
      SHOWS_ID,
      showId
    );

    if (show.google_event_id) {
      try {
        const accessToken = await getValidGoogleAccessToken(
          user.$id,
          user.prefs as {
            googleAccessToken: string;
            googleRefreshToken: string;
            googleTokenExpiry: string;
          }
        );

        await axios.delete(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${show.google_event_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (err) {
        console.error("Erro ao remover evento do Google Calendar:", err);
      }
    }

    await databases.deleteDocument(DATABASE_ID, SHOWS_ID, showId);

    return c.json({ data: { $id: showId } });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        shows: z.array(
          z.object({ $id: z.string(), status: z.nativeEnum(ShowStatus) })
        ),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const { shows } = c.req.valid("json");

      const updatedShows = await Promise.all(
        shows.map(async (show) => {
          const { $id, status } = show;
          return databases.updateDocument(DATABASE_ID, SHOWS_ID, $id, {
            status,
          });
        })
      );

      return c.json({ data: updatedShows });
    }
  )
  .post(
    "/faturamento",
    sessionMiddleware,
    planMiddleware,
    zValidator("json", createFaturamentoSchema),
    async (c) => {
      const user = await getCurrent();
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const despesas = values.despesas.map((despesa) =>
        JSON.stringify(despesa)
      );

      const despesa_musicos = values.despesa_musicos.map((despesa) =>
        JSON.stringify(despesa)
      );

      const faturamento = await databases.createDocument(
        DATABASE_ID,
        FATURAMENTOS_ID,
        ID.unique(),
        {
          ...values,
          despesa_musicos: despesa_musicos,
          despesas: despesas,
          user_id: user?.$id,
        }
      );

      if (faturamento) {
        await databases.updateDocument(DATABASE_ID, SHOWS_ID, values.show_id, {
          status: "FINALIZADO",
        });
      }

      return c.json({ data: faturamento });
    }
  )
  .get("/shows/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const now = new Date();
    const thisMonthStart = startOfMonth(now).toISOString();
    const thisMonthEnd = endOfMonth(now).toISOString();
    const lastMonthStart = startOfMonth(subMonths(now, 1)).toISOString();
    const lastMonthEnd = endOfMonth(subMonths(now, 1)).toISOString();

    const fetchShows = async (
      startDate: string,
      endDate: string,
      status?: ShowStatus
    ) => {
      const filters = [
        Query.greaterThanEqual("data", startDate),
        Query.lessThanEqual("data", endDate),
      ];
      if (status) filters.push(Query.equal("status", status));

      return await databases.listDocuments(DATABASE_ID, SHOWS_ID, filters);
    };

    const thisMonthShows = await fetchShows(thisMonthStart, thisMonthEnd);
    const lastMonthShows = await fetchShows(lastMonthStart, lastMonthEnd);

    const showsCount = thisMonthShows.total;
    const showsDifference = showsCount - lastMonthShows.total;

    // Buscar shows por status
    const statuses: ShowStatus[] = [
      ShowStatus.PENDENTE,
      ShowStatus.CONFIRMADO,
      ShowStatus.FINALIZADO,
    ];

    const results: ShowAnalytics = await statuses.reduce(
      async (accPromise, status) => {
        const acc = await accPromise;

        const thisMonth = await fetchShows(
          thisMonthStart,
          thisMonthEnd,
          status
        );
        const lastMonth = await fetchShows(
          lastMonthStart,
          lastMonthEnd,
          status
        );

        return {
          ...acc,
          [`${status.toLowerCase()}ShowsCount`]: thisMonth.total,
          [`${status.toLowerCase()}ShowsDifference`]:
            thisMonth.total - lastMonth.total,
        };
      },
      Promise.resolve({
        pendenteShowsCount: 0,
        pendenteShowsDifference: 0,
        confirmadoShowsCount: 0,
        confirmadoShowsDifference: 0,
        finalizadoShowsCount: 0,
        finalizadoShowsDifference: 0,
      } as ShowAnalytics)
    );

    return c.json({
      data: {
        showsCount,
        showsDifference,
        ...results,
      },
    });
  });

export default app;
