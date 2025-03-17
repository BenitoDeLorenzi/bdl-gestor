"use client";

import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Account, Client } from "node-appwrite";
import { useEffect, useState } from "react";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const account = new Account(client);

const VarificarPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("userId");
  const secret = params.get("secret");
  const [message, setMessage] = useState("Verificando...");

  useEffect(() => {
    async function verify() {
      if (userId && secret) {
        try {
          await account.updateVerification(String(userId), String(secret));
          setMessage("E-mail verificado! Agora defina sua senha.");
          setTimeout(
            () => router.push(`/definir-senha?userId=${userId}`),
            3000
          );
        } catch (error: any) {
          setMessage("Falha ao verificar e-mail.");
        }
      }
    }
    verify();
  }, [userId, secret]);

  return (
    <div className="w-full lg:max-w-xl">
      <div className="flex flex-col justify-center items-center gap-4">
        <Loader className="size-8 animate-spin" />
        <h1 className="text-xl font-semibold">{message}</h1>
      </div>
    </div>
  );
};

export default VarificarPage;
