import { DATABASE_ID, FATURAMENTOS_ID, SHOWS_ID } from "@/config";
import { Faturamentos } from "@/features/faturamentos/types";
import { Show, ShowStatus } from "@/features/shows/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { Query } from "node-appwrite";

type StatusResumo = {
  PENDENTE: { total: number; valor: number };
  CONFIRMADO: { total: number; valor: number };
  FINALIZADO: { total: number; valor: number };
};

const app = new Hono().get("/analytics/:year", sessionMiddleware, async (c) => {
  const { year } = c.req.param();
  const databases = c.get("databases");

  const startDate = `${year}-01-01T00:00:00.000+00:00`;
  const endDate = `${year}-12-31T23:59:59.999+00:00`;

  // Buscar todos os shows do ano
  const showsResponse = await databases.listDocuments<Show>(
    DATABASE_ID,
    SHOWS_ID,
    [Query.greaterThanEqual("data", startDate), Query.lessThan("data", endDate)]
  );

  const shows = showsResponse.documents || [];

  // Inicializar contadores de status
  const statusResumo: StatusResumo = {
    PENDENTE: { total: 0, valor: 0 },
    CONFIRMADO: { total: 0, valor: 0 },
    FINALIZADO: { total: 0, valor: 0 },
  };

  // Processar os shows e categorizar por status
  const finalizados: string[] = [];

  if (shows.length > 0) {
    shows.forEach((show) => {
      const status = show.status as ShowStatus;

      if (!statusResumo[status]) {
        statusResumo[status] = { total: 0, valor: 0 };
      }

      if (status === "FINALIZADO") {
        finalizados.push(show.$id);
      } else {
        statusResumo[status].total += 1;
        statusResumo[status].valor += show.valor || 0;
      }
    });
  }

  // Buscar faturamento apenas dos shows FINALIZADOS
  if (finalizados.length > 0) {
    const faturamentoResponse = await databases.listDocuments<Faturamentos>(
      DATABASE_ID,
      FATURAMENTOS_ID,
      [Query.equal("show_id", finalizados)]
    );

    faturamentoResponse.documents.forEach((fat) => {
      statusResumo.FINALIZADO.total += 1;
      statusResumo.FINALIZADO.valor += fat.valor_recebido || 0;
    });
  }

  return c.json({
    data: {
      pendente: statusResumo.PENDENTE,
      confirmado: statusResumo.CONFIRMADO,
      finalizado: statusResumo.FINALIZADO,
    },
  });
});

export default app;
