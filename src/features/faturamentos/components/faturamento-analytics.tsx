import { useGetFaturamentoAnalytics } from "../api/use-get-faturamento-analytics";

import { FaturamentoAnalyticsCard } from "./faturamento-analytics-card";
import { Skeleton } from "@/components/ui/skeleton";

interface FaturamentoAnalyticsProps {
  ano: string;
}

const calcularPorcentagemVariacao = (
  atual: number,
  anterior: number
): number => {
  if (anterior === 0) return 0;
  const variacao = ((atual - anterior) / anterior) * 100;
  return Number(variacao.toFixed(2));
};

export const FaturamentoAnalytics = ({ ano }: FaturamentoAnalyticsProps) => {
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetFaturamentoAnalytics({ ano: ano });

  const receitaAnterior = analytics?.anoAnterior.receitas ?? 0;
  const receitaAtual = analytics?.anoAtual.receitas ?? 0;
  const custoAnterior = analytics?.anoAnterior.custo ?? 0;
  const custoAtual = analytics?.anoAtual.custo ?? 0;
  const mediaReceitasAnterior = analytics?.anoAnterior.mediaReceitas ?? 0;
  const mediaReceitasAtual = analytics?.anoAtual.mediaReceitas ?? 0;
  const mediaCustosAnterior = analytics?.anoAnterior.mediaCustos ?? 0;
  const mediaCustosAtual = analytics?.anoAtual.mediaCustos ?? 0;
  const lucroAnterior = analytics?.anoAnterior.lucro ?? 0;
  const lucroAtual = analytics?.anoAtual.lucro ?? 0;

  const porcentagemReceitaAnoAtual = calcularPorcentagemVariacao(
    receitaAtual,
    receitaAnterior
  );
  const porcentagemCustoAnoAtual = calcularPorcentagemVariacao(
    custoAtual,
    custoAnterior
  );
  const porcentagemMediaReceitaAnoAtual = calcularPorcentagemVariacao(
    mediaReceitasAtual,
    mediaReceitasAnterior
  );
  const porcentagemMediaCustoAnoAtual = calcularPorcentagemVariacao(
    mediaCustosAtual,
    mediaCustosAnterior
  );
  const porcentagemLucroAnoAtual = calcularPorcentagemVariacao(
    lucroAtual,
    lucroAnterior
  );

  if (isLoadingAnalytics) {
    return (
      <div className="">
        <Skeleton className="w-full h-[100px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 ">
      <FaturamentoAnalyticsCard
        title="Receitas"
        anoAnterior={analytics?.anoAnterior.ano || new Date().getFullYear()}
        porcentagem={porcentagemReceitaAnoAtual}
        valorAtual={receitaAtual}
        valorAnterior={receitaAnterior}
        bgColor="bg-green-300"
      />
      <FaturamentoAnalyticsCard
        title="Média Receitas"
        anoAnterior={analytics?.anoAnterior.ano || new Date().getFullYear()}
        porcentagem={porcentagemMediaReceitaAnoAtual}
        valorAtual={mediaReceitasAtual}
        valorAnterior={mediaReceitasAnterior}
        bgColor="bg-green-300"
      />
      <FaturamentoAnalyticsCard
        title="Custos"
        anoAnterior={analytics?.anoAnterior.ano || new Date().getFullYear()}
        porcentagem={porcentagemCustoAnoAtual}
        valorAtual={custoAtual}
        valorAnterior={custoAnterior}
        bgColor="bg-red-300"
      />
      <FaturamentoAnalyticsCard
        title="Média Custos"
        anoAnterior={analytics?.anoAnterior.ano || new Date().getFullYear()}
        porcentagem={porcentagemMediaCustoAnoAtual}
        valorAtual={mediaCustosAtual}
        valorAnterior={mediaCustosAnterior}
        bgColor="bg-red-300"
      />
      <FaturamentoAnalyticsCard
        title="Lucro"
        anoAnterior={analytics?.anoAnterior.ano || new Date().getFullYear()}
        porcentagem={porcentagemLucroAnoAtual}
        valorAtual={lucroAtual}
        valorAnterior={lucroAnterior}
        bgColor="bg-blue-300"
      />
    </div>
  );
};
