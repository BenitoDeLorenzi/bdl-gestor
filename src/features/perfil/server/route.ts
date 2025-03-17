import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

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
  .post(
    "/name",
    sessionMiddleware,
    zValidator("json", z.object({ name: z.string(), userId: z.string() })),
    async (c) => {
      const { account } = await createSessionClient();
      const { name } = c.req.valid("json");

      await account.updateName(name);

      return c.json({
        data: { success: true },
      });
    }
  )
  .post(
    "/email",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({ email: z.string().email(), userId: z.string() })
    ),
    async (c) => {
      try {
        const { account } = await createAdminClient();
        const { email, userId } = c.req.valid("json");

        await account.updateEmail(userId, email);

        return c.json({ success: true, error: null });
      } catch (error) {
        const typedError = error as AppwriteError;
        return c.json({ success: false, error: typedError });
      }
    }
  )
  .post(
    "/phone",
    sessionMiddleware,
    zValidator("json", z.object({ phone: z.string(), userId: z.string() })),
    async (c) => {
      try {
        const { users } = await createAdminClient();
        const { phone, userId } = c.req.valid("json");

        console.log("Atualizando telefone");
        console.log("User id:", userId);

        await users.updatePhone(userId, phone);

        return c.json({ success: true, error: null });
      } catch (error) {
        const typedError = error as AppwriteError;
        return c.json({ success: false, error: typedError });
      }
    }
  )
  .post(
    "/password",
    sessionMiddleware,
    zValidator("json", z.object({ password: z.string(), userId: z.string() })),
    async (c) => {
      try {
        const { users } = await createAdminClient();
        const { password, userId } = c.req.valid("json");

        console.log("Atualizando senha");
        console.log("User id:", userId);

        await users.updatePassword(userId, password);

        return c.json({ success: true, error: null });
      } catch (error) {
        const typedError = error as AppwriteError;
        return c.json({ success: false, error: typedError });
      }
    }
  )
  .get("/sessions/:userId", sessionMiddleware, async (c) => {
    const { userId } = c.req.param();
    const { users } = await createAdminClient();

    const result = await users.listSessions(userId);

    return c.json({ data: result });
  })
  .delete(
    "/session",
    sessionMiddleware,
    zValidator("json", z.object({ sessionId: z.string(), userId: z.string() })),
    async (c) => {
      try {
        const { sessionId, userId } = c.req.valid("json");
        const { users } = await createAdminClient();

        await users.deleteSession(userId, sessionId);

        return c.json({ success: true, error: null });
      } catch (error) {
        const typedError = error as AppwriteError;
        return c.json({ success: false, error: typedError });
      }
    }
  );

export default app;
