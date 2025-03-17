import { DATABASE_ID, PROJETOS_FINANCAS_ID, PROJETOS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Projetos, ProjetosFinance } from "../types";
import { createProjetosFinanceSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { getCurrent } from "@/features/auth/queries";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const projetos = await databases.listDocuments<Projetos>(
      DATABASE_ID,
      PROJETOS_ID
    );

    return c.json({ data: projetos });
  })
  .get("/:projetoId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { projetoId } = c.req.param();

    const projeto = await databases.getDocument<Projetos>(
      DATABASE_ID,
      PROJETOS_ID,
      projetoId
    );

    return c.json({ data: projeto });
  })
  .get("/finance/:projetoId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { projetoId } = c.req.param();

    const projetoFinance = await databases.listDocuments<ProjetosFinance>(
      DATABASE_ID,
      PROJETOS_FINANCAS_ID,
      [Query.equal("projeto_id", projetoId), Query.orderDesc("data")]
    );

    return c.json({ data: projetoFinance });
  })
  .get("/finance/movimentos/:financeId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { financeId } = c.req.param();

    const projetoFinance = await databases.getDocument<ProjetosFinance>(
      DATABASE_ID,
      PROJETOS_FINANCAS_ID,
      financeId
    );

    return c.json({ data: projetoFinance });
  })
  .get("/finance/analytics/:projetoId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { projetoId } = c.req.param();

    const finance = await databases.listDocuments<ProjetosFinance>(
      DATABASE_ID,
      PROJETOS_FINANCAS_ID,
      [Query.equal("projeto_id", projetoId), Query.equal("status", "PAGO")]
    );

    const valorEntradas = finance.documents.reduce(
      (acc, item) => (item.tipo === "ENTRADA" ? acc + item.valor : acc),
      0
    );
    const valorSaidas = finance.documents.reduce(
      (acc, item) => (item.tipo === "SAIDA" ? acc + item.valor : acc),
      0
    );

    const totalEntradas = finance.documents.filter(
      (item) => item.tipo === "ENTRADA"
    ).length;

    const totalSaidas = finance.documents.filter(
      (item) => item.tipo === "SAIDA"
    ).length;

    return c.json({
      data: {
        entradas: { valor: valorEntradas, total: totalEntradas },
        saidas: { valor: valorSaidas, total: totalSaidas },
        saldo: {
          valor: valorEntradas - valorSaidas,
          total: finance.documents.length,
        },
      },
    });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", z.object({ nome: z.string() })),
    async (c) => {
      const values = c.req.valid("json");
      const databases = c.get("databases");

      const nomeProjeto = await databases.listDocuments(
        DATABASE_ID,
        PROJETOS_ID,
        [Query.equal("nome", values.nome)]
      );

      if (nomeProjeto.total > 0) {
        return c.json({
          data: {
            success: false,
            message: "Já existe um projeto com esse nome.",
            $id: "",
          },
        });
      } else {
        const projeto = await databases.createDocument<Projetos>(
          DATABASE_ID,
          PROJETOS_ID,
          ID.unique(),
          values
        );

        return c.json({
          data: {
            success: true,
            message: "Projeto criado com sucesso.",
            $id: projeto.$id,
          },
        });
      }
    }
  )
  .post(
    "/finance",
    sessionMiddleware,
    zValidator("json", createProjetosFinanceSchema),
    async (c) => {
      const databases = c.get("databases");
      const values = c.req.valid("json");
      const user = await getCurrent();

      const projetoFinanca = await databases.createDocument(
        DATABASE_ID,
        PROJETOS_FINANCAS_ID,
        ID.unique(),
        {
          ...values,
          user_id: user?.$id,
        }
      );

      return c.json({ data: projetoFinanca });
    }
  )
  .patch(
    "/finance/:financeId",
    sessionMiddleware,
    zValidator("json", createProjetosFinanceSchema),
    async (c) => {
      const { financeId } = c.req.param();
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const projetoFinance = await databases.updateDocument(
        DATABASE_ID,
        PROJETOS_FINANCAS_ID,
        financeId,
        values
      );

      return c.json({ data: projetoFinance });
    }
  )
  .delete("/:projetoId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { projetoId } = c.req.param();

    const projetoFinance = await databases.listDocuments(
      DATABASE_ID,
      PROJETOS_FINANCAS_ID,
      [Query.equal("projeto_id", projetoId)]
    );

    if (projetoFinance.total > 0) {
      return c.json({ data: { success: false, $id: projetoId } });
    } else {
      await databases.deleteDocument(DATABASE_ID, PROJETOS_ID, projetoId);

      return c.json({ data: { success: true, $id: projetoId } });
    }
  })
  .delete("/finance/:financeId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { financeId } = c.req.param();

    await databases.deleteDocument(
      DATABASE_ID,
      PROJETOS_FINANCAS_ID,
      financeId
    );

    return c.json({ data: { $id: financeId } });
  });
export default app;
