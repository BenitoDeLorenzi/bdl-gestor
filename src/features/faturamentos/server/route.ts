import {
  CONTRATANTES_ID,
  DATABASE_ID,
  EQUIPE_ID,
  FATURAMENTOS_ID,
  LOCAIS_ID,
  SHOWS_ID,
} from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { Faturamentos } from "../types";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Shows } from "@/features/shows/types";
import { Equipe } from "@/features/equipe/types";
import { Contratante } from "@/features/contratantes/types";
import { Locais } from "@/features/locais/types";
import { getCurrent } from "@/features/auth/queries";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        page: z.string(),
        totalItems: z.string(),
        ano: z.string().nullish(),
        local: z.string().nullish(),
        contratante: z.string().nullish(),
      })
    ),
    async (c) => {
      const user = await getCurrent();

      const databases = c.get("databases");
      const { page, totalItems, ano, contratante, local } =
        c.req.valid("query");

      const offSet = (parseInt(page) - 1) * parseInt(totalItems);
      const limit = parseInt(totalItems);

      const startDate = new Date(parseInt(ano || ""), 0, 1);
      const endDate = new Date(parseInt(ano || ""), 11, 31);

      const query = [
        Query.orderDesc("data_pagamento"),
        Query.limit(limit),
        Query.offset(offSet),
        Query.equal("user_id", user?.$id || ""),
      ];

      if (ano)
        query.push(
          Query.greaterThanEqual("data_pagamento", startDate.toDateString()),
          Query.lessThanEqual("data_pagamento", endDate.toDateString())
        );

      const faturamentos = await databases.listDocuments<Faturamentos>(
        DATABASE_ID,
        FATURAMENTOS_ID,
        query
      );

      const populatedFaturamentos = await Promise.all(
        faturamentos.documents.map(async (faturamento) => {
          const show = await databases.getDocument<Shows>(
            DATABASE_ID,
            SHOWS_ID,
            faturamento.show_id
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

          return {
            ...faturamento,
            show: {
              ...show,
              contratante,
              local,
              equipe: equipe.documents,
            },
          };
        })
      );

      return c.json({
        data: {
          documents: populatedFaturamentos,
          total: faturamentos.total,
        },
      });
    }
  )
  .get(
    "/analytics",
    sessionMiddleware,
    zValidator("query", z.object({ ano: z.string().nullish() })),
    async (c) => {
      const user = await getCurrent();

      const databases = c.get("databases");
      const { ano } = c.req.valid("query");

      const hoje = new Date();
      const anoAtual = hoje.getFullYear();
      const anoSelecionado = parseInt(ano || anoAtual.toString());

      const startDate = new Date(anoSelecionado, 0, 1);
      const endDate =
        anoSelecionado === anoAtual ? hoje : new Date(anoSelecionado, 11, 31);

      const startDateAnterior = new Date(anoSelecionado - 1, 0, 1);
      const endDateAnterior =
        anoSelecionado === anoAtual
          ? new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate())
          : new Date(anoSelecionado - 1, 11, 31);

      const faturamentos = await databases.listDocuments<Faturamentos>(
        DATABASE_ID,
        FATURAMENTOS_ID,
        [
          Query.limit(10000),
          Query.greaterThanEqual("data_pagamento", startDate.toDateString()),
          Query.lessThanEqual("data_pagamento", endDate.toDateString()),
          Query.equal("user_id", user?.$id || ""),
        ]
      );

      const receitas = faturamentos.documents.reduce((total, fat) => {
        return total + (fat.valor_recebido || 0);
      }, 0);

      const custo = faturamentos.documents.reduce((total, fat) => {
        return total + (fat.valor_despesas || 0);
      }, 0);

      const mediaReceitas =
        faturamentos.total > 0 ? receitas / faturamentos.total : 0;
      const mediaCustos =
        faturamentos.total > 0 ? custo / faturamentos.total : 0;
      const lucro = receitas - custo;

      const faturamentosAnterior = await databases.listDocuments<Faturamentos>(
        DATABASE_ID,
        FATURAMENTOS_ID,
        [
          Query.limit(10000),
          Query.greaterThanEqual(
            "data_pagamento",
            startDateAnterior.toDateString()
          ),
          Query.lessThanEqual("data_pagamento", endDateAnterior.toDateString()),
          Query.equal("user_id", user?.$id || ""),
        ]
      );

      const receitasAnterior = faturamentosAnterior.documents.reduce(
        (total, fat) => {
          return total + (fat.valor_recebido || 0);
        },
        0
      );

      const custoAnterior = faturamentosAnterior.documents.reduce(
        (total, fat) => {
          return total + (fat.valor_despesas || 0);
        },
        0
      );

      const mediaReceitasAnterior =
        faturamentosAnterior.total > 0
          ? receitasAnterior / faturamentosAnterior.total
          : 0;
      const mediaCustosAnterior =
        faturamentosAnterior.total > 0
          ? custoAnterior / faturamentosAnterior.total
          : 0;
      const lucroAnterior = receitasAnterior - custoAnterior;

      return c.json({
        data: {
          anoAtual: {
            ano: anoSelecionado,
            receitas,
            custo,
            lucro,
            mediaReceitas,
            mediaCustos,
          },
          anoAnterior: {
            ano: anoSelecionado - 1,
            receitas: receitasAnterior,
            custo: custoAnterior,
            lucro: lucroAnterior,
            mediaReceitas: mediaReceitasAnterior,
            mediaCustos: mediaCustosAnterior,
          },
        },
      });
    }
  )
  .delete(
    "/:faturamentoId",
    sessionMiddleware,
    zValidator("json", z.object({ showId: z.string() })),
    async (c) => {
      const { faturamentoId } = c.req.param();
      const { showId } = c.req.valid("json");
      const databases = c.get("databases");

      await databases.deleteDocument(
        DATABASE_ID,
        FATURAMENTOS_ID,
        faturamentoId
      );

      const update = await databases.updateDocument(
        DATABASE_ID,
        SHOWS_ID,
        showId,
        {
          status: "CONFIRMADO",
        }
      );

      console.log(update);

      return c.json({
        data: {
          success: true,
          message: "Faturamento excluido com sucesso!",
          $id: faturamentoId,
        },
      });
    }
  );

export default app;
