"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Ellipsis } from "lucide-react";
import { Card } from "./ui/card";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

const ShowsChart = () => {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);

  const fetchData = async () => {
    const collectionRef = collection(db, "shows");
    const allDocs = await getDocs(collectionRef);

    const meses: Record<string, number> = {
      Jan: 0,
      Fev: 0,
      Mar: 0,
      Abr: 0,
      Mai: 0,
      Jun: 0,
      Jul: 0,
      Ago: 0,
      Set: 0,
      Out: 0,
      Nov: 0,
      Dez: 0,
    };

    // Processar os shows e contar os meses corretamente
    allDocs.forEach((doc) => {
      const show = doc.data();
      if (show.data_show) {
        const mesNome = moment(show.data_show, "YYYY-MM-DD").format("MMM"); // Obtém o nome abreviado do mês
        const mesCorrigido = mesNome.charAt(0).toUpperCase() + mesNome.slice(1); // Capitaliza a primeira letra

        if (mesCorrigido in meses) {
          meses[mesCorrigido]++; // Incrementa a contagem do mês
        }
      }
    });

    // Transformar o objeto meses em array para o gráfico
    const chartData = Object.entries(meses).map(([name, count]) => ({
      name,
      count,
    }));

    setData(chartData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-start">
        <h1 className="font-semibold text-lg">Shows</h1>
        <Ellipsis />
      </div>

      {/* CHART */}
      <div className="w-full h-[90%]">
        <ResponsiveContainer>
          <BarChart accessibilityLayer data={data} margin={{ top: 30 }}>
            <CartesianGrid vertical={false} stroke="#ddd" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
            />
            <YAxis
              tickMargin={30}
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
            />
            <Bar
              dataKey="count"
              fill="#8884d8"
              radius={4}
              legendType="circle"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ShowsChart;
