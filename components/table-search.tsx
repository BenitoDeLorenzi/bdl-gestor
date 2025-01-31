"use client";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import React from "react";

const TableSearch = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget[0] as HTMLInputElement).value;
    const params = new URLSearchParams(window.location.search);
    params.set("search", value);
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-auto ">
      <Input
        className="w-full md:w-[250px]"
        placeholder="Pesquisar na tabela"
      />
    </form>
  );
};

export default TableSearch;
