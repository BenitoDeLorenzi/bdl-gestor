import { DATABASE_ID, NEXT_PUBLIC_APP_URL, USUARIOS_ID } from "@/config";

import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { createUsuariosSchema } from "../schemas";
import { getCurrent } from "@/features/auth/queries";

interface AppwriteError {
  name: string;
  code: number;
  type: string;
  response: {
    message: string;
    code: number;
    type: string;
    version: string;
  };
}

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const { users } = await createAdminClient();

    const result = await users.list();

    return c.json({ data: result });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createUsuariosSchema),
    async (c) => {
      try {
        const values = c.req.valid("json");
        const email = values.email;
        const phone = values.phone ? `+55${values.phone?.trim()}` : undefined;
        const name = values.name;

        const databases = c.get("databases");
        const { users } = await createAdminClient();

        const user = await users.create(
          ID.unique(),
          email,
          phone?.trim(),
          undefined,
          name
        );

        await databases.createDocument(DATABASE_ID, USUARIOS_ID, ID.unique(), {
          user_id: user.$id,
          email: user.email,
          avatar: "",
        });

        return c.json({ success: true, error: null });
      } catch (error) {
        const typedError = error as AppwriteError;
        return c.json({ success: false, error: typedError });
      }
    }
  )
  .delete("/:usuarioId", sessionMiddleware, async (c) => {
    const { usuarioId } = c.req.param();
    const { users } = await createAdminClient();
    const user = await getCurrent();

    if (user?.$id === usuarioId) {
      return c.json({
        data: {
          success: false,
          message: "Você não pode excluir o seu usuário.",
          $id: usuarioId,
        },
      });
    } else {
      await users.delete(usuarioId);

      return c.json({
        data: {
          success: true,
          message: "Usuário excluido com sucesso!",
          $id: usuarioId,
        },
      });
    }
  });

export default app;
