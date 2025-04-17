"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Briefcase,
  ChevronRight,
  CirclePlus,
  HandCoins,
  Home,
  MapPin,
  Music,
  SquareTerminal,
  Trash,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DottedSeparator from "./dotted-separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

import { useCreateProjetosModal } from "@/features/projetos/hooks/use-create-projetos-modal";
import { useGetProjetos } from "@/features/projetos/api/use-get-projetos";
import { useDeleteProjetos } from "@/features/projetos/api/use-delete-projetos";
import { useConfirm } from "@/hooks/use-confirm";
import { useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { SidebarFooterCard } from "./sidebar-footer-card";

const navMain = [
  {
    label: "Shows",
    href: "/dashboard/shows",
    icon: Music,
  },
  {
    label: "Faturamento",
    href: "/dashboard/faturamento",
    icon: HandCoins,
  },
  {
    label: "Equipe",
    href: "/dashboard/equipe",
    icon: Users,
  },
  {
    label: "Contratantes",
    href: "/dashboard/contratantes",
    icon: Briefcase,
  },
  {
    label: "Locais",
    href: "/dashboard/locais",
    icon: MapPin,
  },
];

const navConfig = [
  {
    title: "Tipos",
    href: "tipos",
    icon: SquareTerminal,
    items: [
      {
        title: "Locais",
        href: "/dashboard/tipos/locais",
      },
      {
        title: "Funções",
        href: "/dashboard/tipos/funcoes",
      },
      {
        title: "Instrumentos",
        href: "/dashboard/tipos/instrumentos",
      },
      {
        title: "Projetos",
        href: "/dashboard/tipos/projetos",
      },
    ],
  },
];

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useCreateProjetosModal();
  const { data: projetos, isLoading: isLoadingProjetos } = useGetProjetos();
  const { mutate, isPending: isPendingDelete } = useDeleteProjetos();

  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja excluir esse projeto?",
    "Essa ação não pode ser desfeita.",
    "destructive"
  );

  const onDelete = async (id: string) => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      { param: { projetoId: id } },
      {
        onSuccess: ({ data }) => {
          if (data.success) {
            router.push(`/projetos/${projetos?.documents[0].$id}`);
          }
        },
      }
    );
  };

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return (
    <>
      <ConfirmDialog />
      <Sidebar>
        <SidebarHeader>
          <div className="flex w-full justify-center items-center">
            <Link href="/dashboard">
              <Image
                src="/bdl-logo.svg"
                alt="logo"
                width={120}
                height={60}
                priority
                quality={100}
              />
            </Link>
          </div>
        </SidebarHeader>
        <DottedSeparator className="mb-2" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="mb-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard"}
                  >
                    <Link href="/dashboard">
                      <Home />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              {navMain.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <SidebarMenu key={item.label}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Projetos</SidebarGroupLabel>
            <SidebarGroupAction onClick={open}>
              <CirclePlus />
            </SidebarGroupAction>

            {projetos?.documents.map((projeto) => {
              const isActive = pathname === `/projetos/${projeto.$id}`;

              return (
                <SidebarMenu key={projeto.$id}>
                  <SidebarMenuItem>
                    <SidebarMenuAction onClick={() => onDelete(projeto.$id)}>
                      <Trash />
                    </SidebarMenuAction>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={`/projetos/${projeto.$id}`}>
                        <span className="capitalize">{projeto.nome}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              );
            })}
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Configurações</SidebarGroupLabel>
            <SidebarMenu>
              {navConfig.map((item) => {
                if (item.items.length > 0) {
                  const isActive = pathname.split("/")[2] === item.href;

                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      className="group/collapsible"
                      defaultOpen={isActive}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => {
                              const isSubItemActive = pathname === subItem.href;

                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubItemActive}
                                  >
                                    <a href={subItem.href}>
                                      <span
                                        className={
                                          isSubItemActive ? "font-semibold" : ""
                                        }
                                      >
                                        {subItem.title}
                                      </span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                } else {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenu key={item.title}>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarFooterCard />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
