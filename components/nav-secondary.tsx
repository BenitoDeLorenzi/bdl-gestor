"use client";

import { usePathname } from "next/navigation";
import { Bell, Users } from "lucide-react"; // Importando o tipo para os ícones
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const data = [
  {
    title: "Usuários",
    url: "/usuarios",
    icon: Users,
  },
  {
    title: "Notificaçoes",
    url: "/notificacoes",
    icon: Bell,
  },
];

const NavSecondary = () => {
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

export default NavSecondary;
