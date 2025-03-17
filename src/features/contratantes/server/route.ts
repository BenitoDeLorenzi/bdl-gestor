import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleware";
import { CONTRATANTES_ID, DATABASE_ID, SHOWS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { createContratantesSchema } from "../schemas";
import { Contratante } from "../types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const contratantes = await databases.listDocuments<Contratante>(
      DATABASE_ID,
      CONTRATANTES_ID,
      [Query.orderAsc("nome")]
    );

    return c.json({ data: contratantes });
  })
  .get("/:contratanteId", sessionMiddleware, async (c) => {
    const { contratanteId } = c.req.param();
    const databases = c.get("databases");

    const local = await databases.getDocument<Contratante>(
      DATABASE_ID,
      CONTRATANTES_ID,
      contratanteId
    );

    return c.json({ data: local });
  })
  .post(
    "/",
    zValidator("json", createContratantesSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const data = c.req.valid("json");

      const contratantes = await databases.createDocument(
        DATABASE_ID,
        CONTRATANTES_ID,
        ID.unique(),
        data
      );

      return c.json({ data: contratantes });
    }
  )
  .patch(
    "/:contratanteId",
    sessionMiddleware,
    zValidator("json", createContratantesSchema),
    async (c) => {
      const { contratanteId } = c.req.param();
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const contratante = await databases.updateDocument(
        DATABASE_ID,
        CONTRATANTES_ID,
        contratanteId,
        values
      );

      return c.json({ data: contratante });
    }
  )
  .delete("/:contratanteId", sessionMiddleware, async (c) => {
    const { contratanteId } = c.req.param();
    const databases = c.get("databases");

    const shows = await databases.listDocuments(DATABASE_ID, SHOWS_ID, [
      Query.contains("contratante", contratanteId),
    ]);

    if (shows.total > 0) {
      return c.json({
        data: {
          success: false,
          message: "Existem shows para esse contratante",
          $id: contratanteId,
        },
      });
    }

    await databases.deleteDocument(DATABASE_ID, CONTRATANTES_ID, contratanteId);

    return c.json({
      data: {
        success: true,
        message: "Contratante excluido com sucesso!",
        $id: contratanteId,
      },
    });
  });

export default app;
