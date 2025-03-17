"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

const DefinirSenhaPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("userId");
  const secret = params.get("secret");

  return (
    <div className="w-full lg:max-w-xl">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-2xl font-semibold">Redefina a sua senha</h1>

        <Card className="border-none shadow-none w-full">
          <CardContent className="flex flex-col w-full"></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DefinirSenhaPage;
