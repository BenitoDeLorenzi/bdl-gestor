"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { SidebarTrigger } from "./ui/sidebar";
import { usePathname } from "next/navigation";

const subTitles: Record<string, string> = {
  locais: "Locais",
  funcoes: "Funções",
  instrumentos: "Instrumentos",
  projetos: "Projetos",
};

export const Navbar = () => {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const title = pathSegments[1] || "home";
  const subTitle = pathSegments[2] || "";

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex items-center justify-center gap-2">
        <SidebarTrigger />
        <div className="flex">
          <h1 className="text-2xl font-semibold capitalize">
            {title} {subTitles[subTitle] ? `- ${subTitles[subTitle]}` : ""}
          </h1>
        </div>
      </div>
      <UserButton />
    </nav>
  );
};
