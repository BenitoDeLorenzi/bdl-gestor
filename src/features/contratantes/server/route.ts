import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleware";
import { CONTRATANTES_ID, DATABASE_ID, SHOWS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { createContratantesSchema } from "../schemas";
import { Contratante } from "../types";
import { z } from "zod";
import { getCurrent } from "@/features/auth/queries";
import { planMiddleware } from "@/lib/plan-middleware";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        page: z.string(),
        totalItems: z.string(),
        search: z.string().nullish(),
      })
    ),
    async (c) => {
      const user = await getCurrent();
      const databases = c.get("databases");
      const { page, totalItems, search } = c.req.valid("query");

      const offSet = (parseInt(page) - 1) * parseInt(totalItems);
      const limit = parseInt(totalItems);

      const query = [
        Query.orderAsc("nome"),
        Query.limit(limit),
        Query.offset(offSet),
        Query.equal("user_id", user?.$id || ""),
      ];

      if (search) query.push(Query.contains("nome", search));

      const contratantes = await databases.listDocuments<Contratante>(
        DATABASE_ID,
        CONTRATANTES_ID,
        query
      );

      return c.json({ data: contratantes });
    }
  )
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
    planMiddleware,
    async (c) => {
      const user = await getCurrent();
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const contratantes = await databases.createDocument(
        DATABASE_ID,
        CONTRATANTES_ID,
        ID.unique(),
        { ...values, user_id: user?.$id }
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
