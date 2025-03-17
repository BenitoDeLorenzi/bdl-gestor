import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function snakeCaseToTitleCase(str: string) {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const getInitials = (fullName: string): string => {
  if (!fullName.trim()) return "";

  const names = fullName.trim().split(" ");
  const firstInitial = names[0][0].toUpperCase();
  const lastInitial =
    names.length > 1 ? names[names.length - 1][0].toUpperCase() : "";

  return `${firstInitial}${lastInitial}`;
};
