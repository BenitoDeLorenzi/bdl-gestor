"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="container mx-auto text-center pb-20 px-2 md:px-0">
        <nav className="flex justify-between items-center py-4">
          <Link href={`/`}>
            <Image
              src="bdl-logo.svg"
              alt="logo"
              height={75}
              width={150}
              priority
              quality={100}
            />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="secondary" asChild effect="ringHover">
              <Link href={pathname === "/sign-in" ? "sign-up" : "sign-in"}>
                {pathname === "/sign-in" ? "Registrar" : "Entrar"}
              </Link>
            </Button>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
