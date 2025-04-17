import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import equipe from "@/features/equipe/server/route";
import contratantes from "@/features/contratantes/server/route";
import shows from "@/features/shows/server/route";
import locais from "@/features/locais/server/route";
import tipos from "@/features/tipos/server/route";
import faturamentos from "@/features/faturamentos/server/route";
import usuarios from "@/features/usuarios/server/route";
import perfil from "@/features/perfil/server/route";
import dashboard from "@/features/dashboard/server/route";
import projetos from "@/features/projetos/server/route";
import planos from "@/features/planos/server/route";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/equipe", equipe)
  .route("/contratantes", contratantes)
  .route("/shows", shows)
  .route("/locais", locais)
  .route("/tipos", tipos)
  .route("/faturamentos", faturamentos)
  .route("/usuarios", usuarios)
  .route("/perfil", perfil)
  .route("/dashboard", dashboard)
  .route("/projetos", projetos)
  .route("/planos", planos);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type Apptype = typeof routes;
