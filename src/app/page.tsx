import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getCurrent } from "@/features/auth/queries";
import { Check, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PricingCard } from "@/components/pricing-card";

import manGuitar from "../../public/manGuitar.svg";
import logo from "../../public/bdl-logo.svg";

const LandingPage = async () => {
  const user = await getCurrent();

  return (
    <main className="bg-neutral-100 min-h-screen">
      <section className="container mx-auto text-center pb-20 px-4 md:px-0">
        <nav className="flex justify-between items-center py-4">
          <Link href="/">
            <Image
              src="bdl-logo.svg"
              alt="logo"
              height={75}
              width={150}
              priority
              quality={100}
            />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MenuIcon size={24} className="md:hidden cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <a href={"/#funcionamento"}>
                <DropdownMenuItem>Funcionamento</DropdownMenuItem>
              </a>
              <DropdownMenuItem>Preço</DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/sign-in">
                  <Button>Login</Button>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="items-center gap-1 hidden md:flex">
            <Link href={"#funcionamento"}>
              <Button variant={"link"}>Funcionamento</Button>
            </Link>
            <Link href={"#preco"}>
              <Button variant={"link"}>Preço</Button>
            </Link>
            {user && (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            )}
            {!user && (
              <Link href="/sign-in">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </nav>
        <h1 className="md:text-6xl text-2xl font-bold mt-8 md:mt-16">
          Simplifique Seus Shows{" "}
        </h1>
        <p className="text-gray-500 mt-4 text-sm md:text-xl max-w-3xl mx-auto">
          Centralize a agenda, controle os cachês, organize os músicos e tenha o
          controle total da sua banda em um só lugar. Simplifique a gestão dos
          seus shows com eficiência e profissionalismo.
        </p>
        <form className="md:mt-16 mt-10">
          <div className="flex items-center justify-center">
            <div className="flex gap-2 justify-center">
              <Input
                placeholder="Coloque seu email"
                type="text"
                className="w-full md:w-[400px] border-gray-300 border"
              />
              <Button asChild>
                <Link href="/sign-up">Experimente Grátis</Link>
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Comece sua assinatura agora mesmo. Cancele quando quiser.{" "}
          </p>
        </form>
      </section>
      <section className="bg-white md:py-16 py-8" id="funcionamento">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center">
            Como funciona?
          </h2>
          <div className="mx-24 xl:mx-80 flex flex-col md:flex-row items-center justify-between">
            <Image
              src={manGuitar}
              alt="Mulher carregando caixas"
              className="max-w-sm"
            />
            <ul className="md:text-xl text-sm text-muted-foreground space-y-4 md:space-y-6 flex-shrink-0">
              <li className="flex items-center justify-between gap-4">
                Gestão de agenda de shows
                <Check size={24} className="text-green-600" />
              </li>
              <li className="flex items-center justify-between gap-4">
                Controle de cachês e pagamentos
                <Check size={24} className="text-green-600" />
              </li>
              <li className="flex items-center justify-between gap-4">
                Cadastro de músicos e funções
                <Check size={24} className="text-green-600" />
              </li>
              <li className="flex items-center justify-between gap-4">
                Relatórios financeiros mensais
                <Check size={24} className="text-green-600" />
              </li>
              <li className="flex items-center justify-between gap-4">
                Cancele quando quiser
                <Check size={24} className="text-green-600" />
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="md:py-16 py-8 text-center px-4" id="preco">
        <h2 className="md:text-6xl text-2xl font-bold md:mt-16">
          Preço Simples e Transparente
        </h2>
        <p className="text-gray-500 mt-4 text-sm md:text-xl max-w-3xl mx-auto">
          Pra que inúmeros planos, se a gente sabe exatamente o que sua banda
          precisa? Assine o nosso plano Pro Premium VIP e tenha tudo na palma da
          mão: agenda organizada, músicos alinhados, cachês sob controle e muito
          mais. Tudo isso por menos do que você gasta em corda de violão por
          mês. 😉
        </p>

        <div className="flex flex-col justify-center md:flex-row gap-0 md:gap-4">
          <PricingCard
            title="Plano PRO"
            description="Tenha acesso a todas as funcionalidades da plataforma"
            price="R$49.90"
            items={[
              "7 dias gratuitos",
              "Acesso Ilimitado",
              "Gestão de agenda de shows",
              "Controle de cachês e pagamentos",
              "Cadastro de músicos e funções",
              "Relatórios financeiros mensais",
            ]}
          />
        </div>
      </section>
      <section className="bg-white md:py-16 py-10 text-center">
        <h2 className="md:text-6xl text-2xl font-bold md:mt-16">
          Pronto Para Mudar Sua Vida?
        </h2>
        <p className="text-gray-500 mt-4 text-sm md:text-xl max-w-3xl mx-auto">
          Faça como milhares de bandas: assine nossa plataforma e simplifique
          sua gestão de shows.{" "}
        </p>

        <Button asChild className="mt-14 w-96">
          <Link href="/sign-up">Experimente Grátis</Link>
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Comece sua assinatura agora mesmo. Cancele quando quiser.{" "}
        </p>
        <footer className="mt-16 border-t border-gray-300 pt-10">
          <Image
            src={logo}
            alt="Logotipo"
            className="mx-auto"
            width={100}
            height={100}
          />
          <p className="text-muted-foreground">
            {`© ${new Date().getFullYear()} BDLgestor. Todos os direitos reservados.`}
          </p>
        </footer>
      </section>
    </main>
  );
};

export default LandingPage;
