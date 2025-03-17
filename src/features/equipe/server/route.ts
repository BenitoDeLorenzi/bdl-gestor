import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createEquipeSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, EQUIPE_ID, SHOWS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { Equipe } from "../types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const equipe = await databases.listDocuments<Equipe>(
      DATABASE_ID,
      EQUIPE_ID,
      [Query.orderAsc("nome")]
    );

    return c.json({ data: equipe });
  })
  .get("/:equipeId", sessionMiddleware, async (c) => {
    const { equipeId } = c.req.param();
    const databases = c.get("databases");

    const membro = await databases.getDocument<Equipe>(
      DATABASE_ID,
      EQUIPE_ID,
      equipeId
    );

    return c.json({ data: membro });
  })
  .post(
    "/",
    zValidator("json", createEquipeSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const data = c.req.valid("json");

      const equipe = await databases.createDocument(
        DATABASE_ID,
        EQUIPE_ID,
        ID.unique(),
        data
      );

      return c.json({ data: equipe });
    }
  )
  .patch(
    "/:equipeId",
    sessionMiddleware,
    zValidator("json", createEquipeSchema),
    async (c) => {
      const { equipeId } = c.req.param();
      const databases = c.get("databases");
      const values = c.req.valid("json");

      const contratante = await databases.updateDocument(
        DATABASE_ID,
        EQUIPE_ID,
        equipeId,
        values
      );

      return c.json({ data: contratante });
    }
  )
  .delete("/:equipeId", sessionMiddleware, async (c) => {
    const { equipeId } = c.req.param();
    const databases = c.get("databases");

    const shows = await databases.listDocuments(DATABASE_ID, SHOWS_ID, [
      Query.contains("equipe", equipeId),
    ]);

    if (shows.total > 0) {
      return c.json({
        data: {
          success: false,
          message: "Existem shows para esse membro",
          $id: equipeId,
        },
      });
    }

    await databases.deleteDocument(DATABASE_ID, EQUIPE_ID, equipeId);

    return c.json({
      data: {
        success: true,
        message: "Membro excluido com sucesso!",
        $id: equipeId,
      },
    });
  });

export default app;
