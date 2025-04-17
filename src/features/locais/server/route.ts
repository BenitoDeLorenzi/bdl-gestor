import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, LOCAIS_ID, SHOWS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { createLocaisSchema } from "../schemas";
import { Locais } from "../types";
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
        tipo: z.string().nullish(),
        search: z.string().nullish(),
      })
    ),
    async (c) => {
      const user = await getCurrent();
      const databases = c.get("databases");
      const { page, totalItems, tipo, search } = c.req.valid("query");

      const offSet = (parseInt(page) - 1) * parseInt(totalItems);
      const limit = parseInt(totalItems);

      const query = [
        Query.orderAsc("nome"),
        Query.limit(limit),
        Query.offset(offSet),
        Query.equal("user_id", user?.$id || ""),
      ];

      if (tipo) query.push(Query.equal("tipo", tipo));
      if (search) query.push(Query.contains("nome", search));

      const locais = await databases.listDocuments<Locais>(
        DATABASE_ID,
        LOCAIS_ID,
        query
      );

      return c.json({ data: locais });
    }
  )
  .get("/:localId", sessionMiddleware, async (c) => {
    const { localId } = c.req.param();
    const databases = c.get("databases");

    const local = await databases.getDocument<Locais>(
      DATABASE_ID,
      LOCAIS_ID,
      localId
    );

    return c.json({ data: local });
  })
  .post(
    "/",
    zValidator("json", createLocaisSchema),
    sessionMiddleware,
    planMiddleware,
    async (c) => {
      const user = await getCurrent();
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const locais = await databases.createDocument(
        DATABASE_ID,
        LOCAIS_ID,
        ID.unique(),
        { ...values, user_id: user?.$id }
      );

      return c.json({ data: locais });
    }
  )
  .patch(
    "/:localId",
    sessionMiddleware,
    zValidator("json", createLocaisSchema.partial()),
    async (c) => {
      const { localId } = c.req.param();
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const local = await databases.updateDocument(
        DATABASE_ID,
        LOCAIS_ID,
        localId,
        values
      );

      return c.json({ data: local });
    }
  )
  .delete("/:localId", sessionMiddleware, async (c) => {
    const { localId } = c.req.param();
    const databases = c.get("databases");

    const shows = await databases.listDocuments(DATABASE_ID, SHOWS_ID, [
      Query.contains("local", localId),
    ]);

    if (shows.total > 0) {
      return c.json({
        data: {
          success: false,
          message: "Existem shows para esse local",
          $id: localId,
        },
      });
    }

    await databases.deleteDocument(DATABASE_ID, LOCAIS_ID, localId);

    return c.json({
      data: {
        success: true,
        message: "Show excluido com sucesso!",
        $id: localId,
      },
    });
  });

export default app;
