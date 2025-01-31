"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Circle, Ellipsis, Music } from "lucide-react";
import { Card } from "./ui/card";

type DataProps = { name: string; count: number; fill: string }[];

const CountChart = () => {
  const [data, setData] = useState<DataProps>([]);
  const [total, setTotal] = useState(0);
  const [finalizados, setFinalizados] = useState(0);
  const [emAberto, setEmAberto] = useState(0);

  const fetchData = async () => {
    const collectionRef = collection(db, "shows");
    const allDocs = await getDocs(collectionRef);

    let totalCount = allDocs.size;
    let finalizadosCount = 0;
    let emAbertoCount = 0;

    allDocs.forEach((doc) => {
      const show = doc.data();

      if (show.finalizado === true) {
        finalizadosCount++;
      } else {
        emAbertoCount++;
      }
    });

    setTotal(totalCount);
    setFinalizados(finalizadosCount);
    setEmAberto(emAbertoCount);

    setData([
      {
        name: "Total",
        count: totalCount,
        fill: "white",
      },
      {
        name: "Finalizados",
        count: finalizadosCount,
        fill: "#82ca9d",
      },
      {
        name: "Em aberto",
        count: emAbertoCount,
        fill: "#8884d8",
      },
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-start">
        <h1 className="font-semibold text-lg">Situação dos shows</h1>
        <Ellipsis />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Music
          size={40}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="text-center">
          <Circle size={20} color="#82ca9d" fill="#82ca9d" />
          <h1 className="font-bold">{finalizados}</h1>
          <h2 className="text-xs text-zinc-400">
            Finalizados (
            {total > 0 ? ((finalizados / total) * 100).toFixed(1) : 0}%)
          </h2>
        </div>
        <div className="text-center">
          <Circle size={20} color="#8884d8" fill="#8884d8" />
          <h1 className="font-bold">{emAberto}</h1>
          <h2 className="text-xs text-zinc-400">
            Em aberto ({total > 0 ? ((emAberto / total) * 100).toFixed(1) : 0}%)
          </h2>
        </div>
      </div>
    </Card>
  );
};

export default CountChart;
