import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import next from "next";

// Inicializa o Firebase Admin
admin.initializeApp();

// Configuração do Next.js no Firebase Functions
const app = next({ dev: false, conf: { distDir: ".next" } });
const handle = app.getRequestHandler();

export const nextApp = onRequest(async (req, res) => {
  await app.prepare();
  return handle(req, res);
});
