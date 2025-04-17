import { google } from "googleapis";
import { createAdminClient } from "@/lib/appwrite";

type GooglePrefs = {
  googleAccessToken: string;
  googleRefreshToken: string;
  googleTokenExpiry: string;
};

export async function getValidGoogleAccessToken(
  userId: string,
  prefs: GooglePrefs
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: prefs.googleAccessToken,
    refresh_token: prefs.googleRefreshToken,
    expiry_date: parseInt(prefs.googleTokenExpiry || "0"),
  });

  const now = Date.now();
  const expiry = parseInt(prefs.googleTokenExpiry || "0");

  // ⚠️ Considera expirado se estiver dentro dos próximos 60 segundos
  const isExpired = expiry - now < 60_000;

  if (isExpired && prefs.googleRefreshToken) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      const { users } = await createAdminClient();

      // 💾 Atualiza as prefs no Appwrite
      await users.updatePrefs(userId, {
        googleAccessToken: credentials.access_token,
        googleRefreshToken:
          credentials.refresh_token || prefs.googleRefreshToken, // mantém o antigo se não vier novo
        googleTokenExpiry: credentials.expiry_date?.toString() || "",
      });

      return credentials.access_token;
    } catch (err) {
      console.error("Erro ao renovar token do Google:", err);
      throw new Error("Falha ao renovar token de acesso do Google");
    }
  }

  return prefs.googleAccessToken;
}
