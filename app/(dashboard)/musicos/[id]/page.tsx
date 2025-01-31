import { getMusicoById } from "@/lib/actions";
import { Musicos } from "../page";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import FormContainer from "@/components/form-container";
import { Calendar, CircleDollarSign, Music, Phone } from "lucide-react";

const SingleMusicoPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const musico: Musicos = (await getMusicoById(id)) as Musicos;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-2 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex bg-zinc-200 rounded-md p-4 gap-4">
            <div className="flex flex-1 gap-4 justify-center items-center">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={musico.img || "https://github.com/shadcn.png"}
                  alt="avatarImg"
                  className="object-cover"
                />
              </Avatar>
              <div className="flex flex-col flex-1 gap-2">
                <div className="flex justify-between  flex-1">
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-lg">{musico.nome}</h1>
                    <span className="text-sm text-gray-500">
                      {musico.funcao}
                    </span>
                  </div>
                  <FormContainer table="musico" type="update" data={musico} />
                </div>
                <div className="flex gap-2 flex-wrap justify-between">
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <span className="text-sm">{musico.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music size={18} />
                    <span className="text-sm">{musico.instrumento}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleDollarSign size={18} />
                    <span className="text-sm">
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(musico.cache_medio)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
            <div className="flex flex-col justify-between bg-zinc-500 rounded-md p-2">
              <Calendar color="white" />
              <h1 className="text-white font-semibold text-4xl text-center">
                90%
              </h1>
              <span className="text-white text-sm">Frequência</span>
            </div>
            <div className="flex flex-col justify-between bg-zinc-500 rounded-md p-2">
              <Music color="white" />
              <h1 className="text-white font-semibold text-4xl text-center">
                18
              </h1>
              <span className="text-white text-sm">Shows</span>
            </div>
            <div className="flex flex-col justify-between bg-zinc-500 rounded-md p-2">
              <CircleDollarSign color="white" />
              <h1 className="text-white font-semibold text-lg text-center">
                R$ 2.3500,00
              </h1>
              <span className="text-white text-sm">Cachês</span>
            </div>
          </div>
        </div>
        <div>Bottom</div>
      </div>
      <div>Rigth</div>
    </div>
  );
};

export default SingleMusicoPage;
