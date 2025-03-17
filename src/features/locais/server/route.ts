import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, LOCAIS_ID, SHOWS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { createLocaisSchema } from "../schemas";
import { Locais } from "../types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const locais = await databases.listDocuments<Locais>(
      DATABASE_ID,
      LOCAIS_ID,
      [Query.orderAsc("nome")]
    );

    return c.json({ data: locais });
  })
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
    async (c) => {
      const databases = c.get("databases");
      const data = c.req.valid("json");

      const locais = await databases.createDocument(
        DATABASE_ID,
        LOCAIS_ID,
        ID.unique(),
        data
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
