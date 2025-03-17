import { DATABASE_ID, FATURAMENTOS_ID, SHOWS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { Faturamentos } from "../types";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const faturamentos = await databases.listDocuments<Faturamentos>(
      DATABASE_ID,
      FATURAMENTOS_ID,
      [Query.orderDesc("data_pagamento")]
    );

    return c.json({
      data: faturamentos,
    });
  })
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
