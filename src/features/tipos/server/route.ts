import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { DATABASE_ID, TIPOS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { Tipos } from "../types";
import { zValidator } from "@hono/zod-validator";
import { createTiposSchema } from "../schemas";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { tipo } = c.req.query();

    const tipos = await databases.listDocuments<Tipos>(DATABASE_ID, TIPOS_ID, [
      Query.equal("tipo", tipo),
      Query.orderAsc("nome"),
    ]);

    return c.json({ data: tipos });
  })
  .get("/:tipoId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { tipoId } = c.req.param();

    console.log("Buscando tipo:", tipoId);

    const tipo = await databases.getDocument<Tipos>(
      DATABASE_ID,
      TIPOS_ID,
      tipoId
    );

    return c.json({ data: tipo });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTiposSchema),
    async (c) => {
      const databases = c.get("databases");
      const data = c.req.valid("json");

      const tipo = await databases.createDocument(
        DATABASE_ID,
        TIPOS_ID,
        ID.unique(),
        data
      );

      return c.json({ data: tipo });
    }
  )
  .patch(
    "/:tipoId",
    sessionMiddleware,
    zValidator("json", createTiposSchema.partial()),
    async (c) => {
      const { tipoId } = c.req.param();
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const local = await databases.updateDocument(
        DATABASE_ID,
        TIPOS_ID,
        tipoId,
        {
          nome: values.nome,
        }
      );

      return c.json({ data: local });
    }
  )
  .delete("/:tipoId", sessionMiddleware, async (c) => {
    const { tipoId } = c.req.param();
    const databases = c.get("databases");

    await databases.deleteDocument(DATABASE_ID, TIPOS_ID, tipoId);

    return c.json({
      data: {
        success: true,
        message: "Show excluido com sucesso!",
        $id: tipoId,
      },
    });
  });

export default app;
