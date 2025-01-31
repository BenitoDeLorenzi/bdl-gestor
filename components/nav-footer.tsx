"use client";

import { Bell, LogOut } from "lucide-react";

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";

import { useAuth, useUser } from "@clerk/nextjs";
import { useSidebar } from "./ui/sidebar";

const NavFooter = () => {
  const { isMobile } = useSidebar();
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.imageUrl} alt={user?.id} />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.fullName}</span>
            <span className="truncate text-xs">
              {user?.emailAddresses[0].emailAddress}
            </span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <Bell />
          Notificações
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => signOut()}>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default NavFooter;

{
  /*  */
}
