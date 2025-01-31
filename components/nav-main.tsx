"use client";

import { usePathname } from "next/navigation";
import { Briefcase, Guitar, Home, Landmark, Music } from "lucide-react"; // Importando o tipo para os ícones
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const data = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Shows",
    url: "/shows",
    icon: Music,
  },
  {
    title: "Músicos",
    url: "/musicos",
    icon: Guitar,
  },
  {
    title: "Contratantes",
    url: "/contratantes",
    icon: Briefcase,
  },
  {
    title: "Faturamento",
    url: "/faturamento",
    icon: Landmark,
  },
];

const NavMain = () => {
  const pathname = usePathname();
  const isActive = (url: string) => pathname === url;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.map((item) => {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <a href={item.url} className="flex items-center gap-2">
                  {item.icon && <item.icon />}
                  <span
                    className={`${isActive(item.url) ? "font-semibold" : ""}`}
                  >
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
