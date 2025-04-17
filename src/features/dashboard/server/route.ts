import {
  CONTRATANTES_ID,
  DATABASE_ID,
  EQUIPE_ID,
  FATURAMENTOS_ID,
  LOCAIS_ID,
  SHOWS_ID,
} from "@/config";
import { getCurrent } from "@/features/auth/queries";
import { Contratante } from "@/features/contratantes/types";
import { Equipe } from "@/features/equipe/types";
import { Faturamentos } from "@/features/faturamentos/types";
import { Locais } from "@/features/locais/types";
import { Show, Shows, ShowStatus } from "@/features/shows/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Hono } from "hono";
import { Query } from "node-appwrite";

type StatusResumo = {
  PENDENTE: { total: number; valor: number };
  CONFIRMADO: { total: number; valor: number };
  FINALIZADO: { total: number; valor: number };
};

interface ProjetoCount {
  projeto: string;
  count: number;
  fill: string;
}

const projetosColorMap: Record<string, string> = {
  Acustico: "#2563eb",
  "Banda completa": "#60a5fa",
  "Banda reduzida": "#93c5fd",
};

const agruparProjetos = (shows: { projeto: string }[]): ProjetoCount[] => {
  const contagem = shows.reduce<ProjetoCount[]>((acc, item) => {
    const projetoExistente = acc.find((p) => p.projeto === item.projeto);

    if (projetoExistente) {
      projetoExistente.count += 1;
    } else {
      acc.push({
        projeto: item.projeto || "",
        count: 1,
        fill: projetosColorMap[item.projeto] || "#3b82f6",
      });
    }

    return acc;
  }, []);

  return contagem.map((p) => ({
    ...p,
    projeto: p.projeto.replace(/\s+/g, "_").toLowerCase(),
  }));
};

const getStatusResumo = async (
  shows: Show[],
  databases: any,
  userId: string
): Promise<StatusResumo> => {
  const statusResumo: StatusResumo = {
    PENDENTE: { total: 0, valor: 0 },
    CONFIRMADO: { total: 0, valor: 0 },
    FINALIZADO: { total: 0, valor: 0 },
  };

  const finalizados: string[] = [];

  shows.forEach((show) => {
    const status = show.status as ShowStatus;

    if (status === "FINALIZADO") {
      finalizados.push(show.$id);
    } else if (statusResumo[status]) {
      statusResumo[status].total += 1;
      statusResumo[status].valor += show.valor || 0;
    }
  });

  if (finalizados.length > 0) {
    const faturamentoResponse = (await databases.listDocuments(
      DATABASE_ID,
      FATURAMENTOS_ID,
      [
        Query.equal("show_id", finalizados),
        Query.limit(10000),
        Query.equal("user_id", userId),
      ]
    )) as { documents: Faturamentos[]; total: number };

    faturamentoResponse.documents.forEach((fat) => {
      statusResumo.FINALIZADO.total += 1;
      statusResumo.FINALIZADO.valor += fat.valor_recebido || 0;
    });
  }

  return statusResumo;
};

const getShowsMensais = (shows: Show[]) => {
  const meses: Record<string, number> = {
    jan: 0,
    fev: 0,
    mar: 0,
    abr: 0,
    mai: 0,
    jun: 0,
    jul: 0,
    ago: 0,
    set: 0,
    out: 0,
    nov: 0,
    dez: 0,
  };

  shows.forEach((show) => {
    if (show.data) {
      const mesNome = format(new Date(show.data), "MMM", {
        locale: ptBR,
      }).toLowerCase();
      if (mesNome in meses) meses[mesNome]++;
    }
  });

  return Object.entries(meses).map(([mes, count]) => ({ mes, count }));
};

const app = new Hono()
  .get("/analytics/:year", sessionMiddleware, async (c) => {
    const user = await getCurrent();
    const { year } = c.req.param();
    const databases = c.get("databases");

    const startDate = `${year}-01-01T00:00:00.000+00:00`;
    const endDate = `${year}-12-31T23:59:59.999+00:00`;

    const showsResponse = (await databases.listDocuments(
      DATABASE_ID,
      SHOWS_ID,
      [
        Query.greaterThanEqual("data", startDate),
        Query.lessThan("data", endDate),
        Query.limit(10000),
        Query.equal("user_id", user?.$id || ""),
      ]
    )) as { documents: Show[]; total: number };

    const shows = showsResponse.documents || [];

    const statusResumo = await getStatusResumo(
      shows,
      databases,
      user?.$id || ""
    );

    return c.json({
      data: {
        pendente: statusResumo.PENDENTE,
        confirmado: statusResumo.CONFIRMADO,
        finalizado: statusResumo.FINALIZADO,
      },
    });
  })
  .get("/charts/:year", sessionMiddleware, async (c) => {
    const user = await getCurrent();
    const { year } = c.req.param();
    const databases = c.get("databases");

    const startDate = `${year}-01-01T00:00:00.000+00:00`;
    const endDate = `${year}-12-31T23:59:59.999+00:00`;

    const showsResponse = (await databases.listDocuments(
      DATABASE_ID,
      SHOWS_ID,
      [
        Query.greaterThanEqual("data", startDate),
        Query.lessThan("data", endDate),
        Query.limit(10000),
        Query.equal("user_id", user?.$id || ""),
      ]
    )) as { documents: Show[]; total: number };

    const shows = showsResponse.documents || [];

    const projetos = agruparProjetos(shows);
    const showsMensais = getShowsMensais(shows);

    return c.json({
      data: {
        projetos,
        showsMensais,
        total: showsResponse.total,
      },
    });
  })
  .get("/shows-mes/:month", sessionMiddleware, async (c) => {
    const user = await getCurrent();
    const { month } = c.req.param();
    const databases = c.get("databases");

    const startDate = `${month}-01T00:00:00.000+00:00`;
    const endDate = `${month}-31T23:59:59.999+00:00`;

    const shows = (await databases.listDocuments(DATABASE_ID, SHOWS_ID, [
      Query.greaterThanEqual("data", startDate),
      Query.lessThan("data", endDate),
      Query.orderDesc("data"),
      Query.limit(10000),
      Query.equal("user_id", user?.$id || ""),
    ])) as { documents: Shows[]; total: number };

    const equipeIds = shows.documents.flatMap((show) =>
      Array.isArray(show.equipe)
        ? show.equipe.map((membro) =>
            typeof membro === "string" ? membro : membro.$id
          )
        : []
    );

    const contratantesIds = shows.documents
      .map((show) =>
        typeof show.contratante === "string"
          ? show.contratante
          : show.contratante?.$id
      )
      .filter(Boolean) as string[];

    const locaisIds = shows.documents
      .map((show) =>
        typeof show.local === "string" ? show.local : show.local?.$id
      )
      .filter(Boolean) as string[];

    const equipeDocs = await databases.listDocuments<Equipe>(
      DATABASE_ID,
      EQUIPE_ID,
      equipeIds.length > 0 ? [Query.contains("$id", equipeIds)] : []
    );

    const contratanteDocs = await databases.listDocuments<Contratante>(
      DATABASE_ID,
      CONTRATANTES_ID,
      contratantesIds.length > 0 ? [Query.contains("$id", contratantesIds)] : []
    );

    const locaisDocs = await databases.listDocuments<Locais>(
      DATABASE_ID,
      LOCAIS_ID,
      locaisIds.length > 0 ? [Query.contains("$id", locaisIds)] : []
    );

    const populatedShows: Shows[] = shows.documents.map((show) => {
      return {
        ...show,
        equipe: Array.isArray(show.equipe)
          ? show.equipe
              .map((id) =>
                typeof id === "string"
                  ? equipeDocs.documents.find((membro) => membro.$id === id) ??
                    null
                  : id
              )
              .filter((membro): membro is Equipe => membro !== null)
          : [],

        contratante:
          typeof show.contratante === "string"
            ? contratanteDocs.documents.find(
                (c) => c.$id === show.contratante
              ) ?? show.contratante
            : show.contratante,

        local:
          typeof show.local === "string"
            ? locaisDocs.documents.find((c) => c.$id === show.local) ??
              show.local
            : show.local,
      };
    });

    return c.json({ data: { ...shows, documents: populatedShows } });
  });

export default app;
