"use client";

import { Bell, Ellipsis } from "lucide-react";
import { Card } from "./ui/card";
import moment from "moment";

const Notificacoes = () => {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-center justify-between">
        <div className=" flex items-center justify-center gap-2">
          <Bell />
          <h1 className="text-lg font-semibold">Notificações</h1>
        </div>
        <span className="text-sm text-zinc-500">Ver todos</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-blue-100 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium ">Lorem ipsum dolor</h2>
            <span className="text-xs text-zinc-400 font-semibold bg-white rounded-md px-1 py-1">
              {moment().format("DD-MM-YYYY")}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
            numquam sed blanditiis deserunt repellat ab nesciunt quasi fuga quia
            minus nisi laborum animi
          </p>
        </div>
        <div className="bg-purple-100 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium ">Lorem ipsum dolor</h2>
            <span className="text-xs text-zinc-400 font-semibold bg-white rounded-md px-1 py-1">
              {moment().format("DD-MM-YYYY")}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
            numquam sed blanditiis deserunt repellat ab nesciunt quasi fuga quia
            minus nisi laborum animi
          </p>
        </div>
        <div className="bg-yellow-100 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium ">Lorem ipsum dolor</h2>
            <span className="text-xs text-zinc-400 font-semibold bg-white rounded-md px-1 py-1">
              {moment().format("DD-MM-YYYY")}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
            numquam sed blanditiis deserunt repellat ab nesciunt quasi fuga quia
            minus nisi laborum animi
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Notificacoes;
