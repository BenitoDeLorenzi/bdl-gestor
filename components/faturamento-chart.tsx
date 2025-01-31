"use client";

import { useEffect, useState } from "react";
import { Ellipsis } from "lucide-react";
import { Card } from "./ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

const FaturamentoChart = () => {
  const [data, setData] = useState<
    { name: string; entradas: number; saidas: number }[]
  >([]);

  const fetchData = async () => {
    try {
      const collectionRef = collection(db, "faturamentos");
      const allDocs = await getDocs(collectionRef);

      console.log(
        "🔍 Dados brutos do Firestore:",
        allDocs.docs.map((doc) => doc.data())
      );

      const meses: Record<string, { entradas: number; saidas: number }> = {
        Jan: { entradas: 0, saidas: 0 },
        Fev: { entradas: 0, saidas: 0 },
        Mar: { entradas: 0, saidas: 0 },
        Abr: { entradas: 0, saidas: 0 },
        Mai: { entradas: 0, saidas: 0 },
        Jun: { entradas: 0, saidas: 0 },
        Jul: { entradas: 0, saidas: 0 },
        Ago: { entradas: 0, saidas: 0 },
        Set: { entradas: 0, saidas: 0 },
        Out: { entradas: 0, saidas: 0 },
        Nov: { entradas: 0, saidas: 0 },
        Dez: { entradas: 0, saidas: 0 },
      };

      // Processar os faturamentos e somar os valores corretamente
      allDocs.forEach((doc) => {
        const faturamento = doc.data();

        if (faturamento.data_show) {
          const mesNome = moment(faturamento.data_show, "YYYY-MM-DD").format(
            "MMM"
          ); // Nome abreviado do mês
          const mesCorrigido =
            mesNome.charAt(0).toUpperCase() + mesNome.slice(1); // Capitaliza a primeira letra

          console.log(
            `📅 Processando data: ${faturamento.data} → ${mesCorrigido}`
          );

          if (mesCorrigido in meses) {
            meses[mesCorrigido].entradas += faturamento.valor || 0;
            meses[mesCorrigido].saidas += faturamento.valor_despesas || 0;
          }
        }
      });

      // Transformar o objeto meses em array para o gráfico
      const chartData = Object.entries(meses).map(([name, values]) => ({
        name,
        entradas: values.entradas,
        saidas: values.saidas,
      }));

      console.log("📊 Dados processados para o gráfico:", chartData);

      setData(chartData);
    } catch (error) {
      console.error("❌ Erro ao buscar faturamentos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-start">
        <h1 className="font-semibold text-lg">Faturamento</h1>
        <Ellipsis />
      </div>
      {/* CHART */}
      <div className="w-full h-[90%]">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ left: 50, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "#d1d5db" }}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickFormatter={(val) =>
                Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(val)
              }
            />
            <Legend
              align="center"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "20px", paddingBottom: "30px" }}
            />
            <Line
              type="monotone"
              dataKey="entradas"
              stroke="#82ca9d"
              strokeWidth={4}
            />
            <Line
              type="monotone"
              dataKey="saidas"
              stroke="#8884d8"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default FaturamentoChart;
