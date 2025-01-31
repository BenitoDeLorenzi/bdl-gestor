import {
  ArrowBigDownDash,
  ArrowBigUpDash,
  Briefcase,
  Ellipsis,
  Guitar,
  Landmark,
  Music,
} from "lucide-react";
import { Card } from "./ui/card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import Link from "next/link";
import { Separator } from "./ui/separator";

type HomeCardType = "shows" | "musicos" | "contratantes" | "faturamento";

const icons: Record<
  HomeCardType,
  React.ComponentType<{ className?: string }>
> = {
  shows: Music,
  musicos: Guitar,
  contratantes: Briefcase,
  faturamento: Landmark,
};

const HomeCard = async ({ type }: { type: HomeCardType }) => {
  const collectionRef = collection(db, type);
  const allDocs = await getDocs(collectionRef);
  const count = allDocs.size;

  const Icon = icons[type];

  let totalDespesas = 0;
  let totalFaturamento = 0;

  if (type === "faturamento") {
    const faturamentosSnapshot = await getDocs(collection(db, "faturamentos"));
    faturamentosSnapshot.forEach((doc) => {
      const data = doc.data();
      totalDespesas += data.valor_despesas || 0;
      totalFaturamento += data.valor || 0;
    });
  }

  return (
    <Card className="odd:bg-zinc-100 p-4 flex-1 min-w-[130px]">
      <div>
        <div className="flex justify-between items-center">
          <Icon className="w-6 h-6 text-zinc-500" />{" "}
          {/* Agora o ícone é renderizado corretamente */}
          <Link href={`/${type}`}>
            <Ellipsis className="w-6 h-6 text-zinc-500" />
          </Link>
        </div>
        <h1 className="text-2xl font-semibold my-4">
          {type !== "faturamento" ? (
            count
          ) : (
            <div>
              <div className="">
                <div className="flex gap-2 items-center justify-between">
                  <p className="text-sm">
                    {Intl.NumberFormat("pr-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalFaturamento)}
                  </p>
                  <ArrowBigUpDash color="#2ecc71" />
                </div>
              </div>
              <Separator />
              <div className="">
                <div className="flex gap-2 items-center justify-between">
                  <p className="text-sm">
                    {Intl.NumberFormat("pr-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalDespesas)}
                  </p>
                  <ArrowBigDownDash color="#e74c3c" />
                </div>
              </div>
            </div>
          )}
        </h1>
        <h2 className="capitalize text-zinc-400 text-sm font-medium">{type}</h2>
      </div>
    </Card>
  );
};

export default HomeCard;
