import {
  DATABASE_ID,
  PROJETOS_CATEGORIAS_ID,
  PROJETOS_FINANCAS_ID,
  PROJETOS_ID,
  PROJETOS_MENSAGENS_ID,
} from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import {
  Projetos,
  ProjetosCategorias,
  ProjetosFinance,
  ProjetosMessages,
} from "../types";
import {
  createProjetosCategoriasSchema,
  createProjetosFinanceSchema,
} from "../schemas";
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
  .get(
    "/finance/:projetoId",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        page: z.string(),
        totalItems: z.string(),
        status: z.string().nullish(),
        categoria: z.string().nullish(),
        forma_pagamento: z.string().nullish(),
        tipo: z.string().nullish(),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const { projetoId } = c.req.param();
      const { page, totalItems, categoria, forma_pagamento, status, tipo } =
        c.req.valid("query");

      const offSet = (parseInt(page) - 1) * parseInt(totalItems);
      const limit = parseInt(totalItems);

      const query = [
        Query.equal("projeto_id", projetoId),
        Query.orderDesc("data"),
        Query.limit(limit),
        Query.offset(offSet),
      ];

      if (tipo) query.push(Query.equal("tipo", tipo));
      if (status) query.push(Query.equal("status", status));
      if (categoria) query.push(Query.equal("categoria", categoria));
      if (forma_pagamento)
        query.push(Query.equal("forma_pagamento", forma_pagamento));

      const projetoFinance = await databases.listDocuments<ProjetosFinance>(
        DATABASE_ID,
        PROJETOS_FINANCAS_ID,
        query
      );

      return c.json({ data: projetoFinance });
    }
  )
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
      [Query.equal("projeto_id", projetoId), Query.limit(1000)]
    );

    const valorEntradasPago = finance.documents.reduce(
      (acc, item) =>
        item.tipo === "ENTRADA" && item.status === "PAGO"
          ? acc + item.valor
          : acc,
      0
    );

    const valorEntradasPendente = finance.documents.reduce(
      (acc, item) =>
        item.tipo === "ENTRADA" && item.status === "PENDENTE"
          ? acc + item.valor
          : acc,
      0
    );

    const valorSaidasPago = finance.documents.reduce(
      (acc, item) =>
        item.tipo === "SAIDA" && item.status === "PAGO"
          ? acc + item.valor
          : acc,
      0
    );

    const valorSaidasPendente = finance.documents.reduce(
      (acc, item) =>
        item.tipo === "SAIDA" && item.status === "PENDENTE"
          ? acc + item.valor
          : acc,
      0
    );

    return c.json({
      data: {
        pendente: {
          saida: valorSaidasPendente,
          entrada: valorEntradasPendente,
        },
        pago: {
          saida: valorSaidasPago,
          entrada: valorEntradasPago,
        },
        previsto: {
          custo: valorSaidasPago + valorSaidasPendente,
          saldo: valorEntradasPago + valorEntradasPendente,
        },
        saldo: {
          valor: valorEntradasPago - valorSaidasPago,
        },
      },
    });
  })
  .get(
    "/messages/:projetoNome",
    sessionMiddleware,
    zValidator("query", z.object({ page: z.string(), totalItems: z.string() })),
    async (c) => {
      const databases = c.get("databases");
      const { projetoNome } = c.req.param();
      const { page, totalItems } = c.req.valid("query");

      const offSet = (parseInt(page) - 1) * parseInt(totalItems);
      const limit = parseInt(totalItems);

      const messages = await databases.listDocuments<ProjetosMessages>(
        DATABASE_ID,
        PROJETOS_MENSAGENS_ID,
        [
          Query.equal("projeto", projetoNome),
          Query.limit(limit),
          Query.offset(offSet),
        ]
      );

      return c.json({ data: messages });
    }
  )
  .get("/categorias/:projetoId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { projetoId } = c.req.param();

    const projetoCategorias = await databases.listDocuments<ProjetosCategorias>(
      DATABASE_ID,
      PROJETOS_CATEGORIAS_ID,
      [
        Query.equal("projeto_id", projetoId),
        Query.orderAsc("nome"),
        Query.limit(50),
      ]
    );

    return c.json({ data: projetoCategorias });
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
  .post(
    "/categorias",
    sessionMiddleware,
    zValidator("json", createProjetosCategoriasSchema),
    async (c) => {
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const projetoCategoria = await databases.createDocument(
        DATABASE_ID,
        PROJETOS_CATEGORIAS_ID,
        ID.unique(),
        values
      );

      return c.json({ data: projetoCategoria });
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
  })
  .delete("/categorias/:categoriaId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { categoriaId } = c.req.param();

    await databases.deleteDocument(
      DATABASE_ID,
      PROJETOS_CATEGORIAS_ID,
      categoriaId
    );

    return c.json({ data: { $id: categoriaId } });
  });
export default app;
