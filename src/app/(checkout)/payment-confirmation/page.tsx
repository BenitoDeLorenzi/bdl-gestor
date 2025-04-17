import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const CheckoutReturnPage = async () => {
  return (
    <Card className="max-w-lg mt-10 text-center">
      <CardContent>
        <CardHeader>
          <ShoppingBag className="text-green-500 mx-auto size-12 mb-4" />
          <CardTitle>Assinatura Confirmada</CardTitle>
          <CardDescription>
            Obrigado por se juntar a nossa comunidade BDL Gestor.
          </CardDescription>
        </CardHeader>
        <div className="text-gray-700 text-sm">
          <p>
            Sua assinatura foi processada com sucesso e sua conta está ativa.
          </p>
          <p>Agora é só aproveitar o nosso conteúdo.</p>
          <Button asChild className="mt-12">
            <Link href="/dashboard">Ir para a home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutReturnPage;
