import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXT_PUBLIC_APP_URL,
} from "@/config";
import { google } from "googleapis";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getCookie } from "hono/cookie";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { Account, Client } from "node-appwrite";

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
  .get("/calendar/url", async (c) => {
    const sessionId = getCookie(c, AUTH_COOKIE);

    if (!sessionId) {
      return c.json({ url: "Sessão não encontrada." }, 401);
    }

    const redirectUri = `${NEXT_PUBLIC_APP_URL}/api/perfil/calendar/callback`;
    const scope = "https://www.googleapis.com/auth/calendar";
    const state = encodeURIComponent(sessionId);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

    return c.json({ url: authUrl });
  })
  .get("/calendar/callback", async (c) => {
    const url = new URL(c.req.url);
    const code = url.searchParams.get("code");
    const sessionId = url.searchParams.get("state");

    if (!code || !sessionId) {
      console.error("Code ou sessão ausente");
      return c.text("Código inválido", 400);
    }

    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${NEXT_PUBLIC_APP_URL}/api/perfil/calendar/callback`
      );

      const { tokens } = await oauth2Client.getToken(code);

      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        .setSession(sessionId);

      const account = new Account(client);

      await account.updatePrefs({
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token ?? "",
        googleTokenExpiry: tokens.expiry_date?.toString() ?? "",
      });

      return c.html(`
        <html>
          <head>
            <meta http-equiv="refresh" content="0;url=/perfil" />
            <script>window.location.href = "/perfil";</script>
          </head>
          <body>
            Redirecionando para seu perfil...
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Erro no callback do Google:", error); // <-- esse log é o mais importante
      return c.text("Erro ao conectar com o Google", 500);
    }
  })
  .post("/calendar/disconnect", sessionMiddleware, async (c) => {
    const account = c.get("account");

    try {
      await account.updatePrefs({
        googleAccessToken: "",
        googleRefreshToken: "",
        googleTokenExpiry: "",
      });

      return c.json({ success: true });
    } catch (error) {
      console.error("Erro ao desconectar do Google:", error);
      return c.json({ success: false, error: "Erro ao desconectar." }, 500);
    }
  })
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
