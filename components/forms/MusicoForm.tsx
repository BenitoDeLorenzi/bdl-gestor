/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CirclePlus, Loader2, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { funcaoData, instrumentosData } from "@/utils/data";
import { musicoSchema, MusicoSchema } from "@/lib/formValidationSchema";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createMusico, updateMusico } from "@/lib/actions";
import { Avatar, AvatarImage } from "../ui/avatar";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebaseconfig";

const uploadImageToFirebase = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `musicos/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw new Error("Não foi possível fazer o upload da imagem.");
  }
};

const MusicoForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    data?.img || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<MusicoSchema>({
    resolver: zodResolver(musicoSchema),
    defaultValues: {
      id: data?.id || "",
      nome: data?.nome || "",
      instrumento: data?.instrumento || "",
      funcao: data?.funcao || "",
      telefone: data?.telefone || "",
      cache_medio: data?.cache_medio.toString() || "",
      pix: data?.pix || "",
      img: data?.img || "",
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const [state, formAction] = useFormState(
    type === "create" ? createMusico : updateMusico,
    {
      success: false,
      error: false,
    }
  );

  async function onSubmit(data: MusicoSchema) {
    setLoading(true);
    let imgUrl = data.img;

    if (selectedFile) {
      console.log(selectedFile);
      imgUrl = await uploadImageToFirebase(selectedFile);
    }

    const payload = { ...data, img: imgUrl };

    formAction(payload);
  }

  useEffect(() => {
    if (state.success) {
      toast({
        variant: "default",
        title: `Contratante foi ${
          type === "create" ? "criado" : "atualizado"
        } com sucesso!`,
      });
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  }, [state]);

  return (
    <DialogContent className="max-w-sm md:max-w-2xl" aria-describedby="">
      <DialogHeader>
        <DialogTitle>{`${
          type === "create" ? "Criar" : "Atualizar"
        } músico`}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          {state.error && (
            <span className="text-sm font-semibold text-red-500">
              Algo deu errado
            </span>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 my-2">
            <div className="flex flex-col justify-center items-center">
              <Avatar
                className="w-28 h-28 cursor-pointer"
                onClick={handleAvatarClick}
              >
                <AvatarImage
                  src={selectedImage || "https://github.com/shadcn.png"}
                  alt="Foto do músico"
                  className="object-cover"
                />
              </Avatar>
              <Input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instrumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrumento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {instrumentosData.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 my-2">
            <FormField
              control={form.control}
              name="funcao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {funcaoData.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cache_medio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cachê médio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pix</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            {loading ? (
              <Button disabled>
                {type === "create" ? "Criando" : "Atualizando"}
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button type="submit">
                {type === "create" ? "Criar" : "Atualizar"}
                {type === "create" ? <CirclePlus /> : <RefreshCcw />}
              </Button>
            )}
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default MusicoForm;
